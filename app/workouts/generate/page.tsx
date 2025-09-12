"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { UserProfile } from "@/types/fitness"

const WORKOUT_TYPES = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Flexibility/Yoga",
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Core"
]

export default function GenerateWorkout() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    workoutType: "",
    limitations: ""
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/signin")
        return
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setProfile(data)
      } else {
        router.push("/onboarding")
        return
      }
      
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsGenerating(true)
    toast.loading("Generating your personalized workout...", { id: "workout-generation" })

    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: profile.fitness_goal,
          level: profile.experience_level,
          time: profile.available_time,
          equipment: profile.equipment,
          limitations: formData.limitations,
          workoutType: formData.workoutType
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Error:', response.status, errorData)
        throw new Error(`Failed to generate workout: ${response.status}`)
      }

      const workout = await response.json()
      toast.success("Workout generated successfully!", { id: "workout-generation" })
      router.push(`/workouts/${workout.id}`)
    } catch (error) {
      console.error('Error generating workout:', error)
      toast.error("Failed to generate workout. Please try again.", { id: "workout-generation" })
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PageBreadcrumb />
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Generate New Workout</h1>
            <p className="text-muted-foreground">
              Create a personalized workout based on your preferences
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Based on your fitness profile setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Goal</Label>
                  <p className="text-sm text-muted-foreground">{profile?.fitness_goal}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Experience</Label>
                  <p className="text-sm text-muted-foreground">{profile?.experience_level}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm text-muted-foreground">{profile?.available_time} minutes</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Equipment</Label>
                  <p className="text-sm text-muted-foreground">
                    {profile?.equipment.join(", ") || "None specified"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workout Preferences</CardTitle>
                <CardDescription>
                  Customize this specific workout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workout-type">Workout Type</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, workoutType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORKOUT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="limitations">Any limitations or focus areas?</Label>
                    <Textarea
                      id="limitations"
                      placeholder="e.g., knee injury, focus on upper body, prefer bodyweight exercises..."
                      value={formData.limitations}
                      onChange={(e) => setFormData(prev => ({ ...prev, limitations: e.target.value }))}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!formData.workoutType || isGenerating}
                  >
                    {isGenerating ? "Generating workout..." : "Generate Workout"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}