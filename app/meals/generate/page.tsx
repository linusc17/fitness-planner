"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { UserProfile } from "@/types/fitness"

export default function GenerateMealPlan() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    calories: "",
    preferences: ""
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
        const defaultCalories = getDefaultCalories(data.fitness_goal)
        setFormData(prev => ({ ...prev, calories: defaultCalories.toString() }))
      } else {
        router.push("/onboarding")
        return
      }
      
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  const getDefaultCalories = (goal: string): number => {
    switch (goal.toLowerCase()) {
      case 'weight loss':
        return 1800
      case 'muscle gain':
        return 2500
      case 'endurance':
        return 2200
      default:
        return 2000
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsGenerating(true)
    toast.loading("Creating your personalized meal plan...", { id: "meal-generation" })

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: profile.fitness_goal,
          restrictions: profile.dietary_restrictions,
          calories: parseInt(formData.calories),
          preferences: formData.preferences.split(',').map(p => p.trim()).filter(p => p)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate meal plan')
      }

      const mealPlan = await response.json()
      toast.success("Meal plan created successfully!", { id: "meal-generation" })
      router.push(`/meals/${mealPlan.id}`)
    } catch (error) {
      console.error('Error generating meal plan:', error)
      toast.error("Failed to generate meal plan. Please try again.", { id: "meal-generation" })
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
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
            <h1 className="text-3xl font-bold">Generate Meal Plan</h1>
            <p className="text-muted-foreground">
              Create a personalized weekly meal plan
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
                  <Label className="text-sm font-medium">Dietary Restrictions</Label>
                  <p className="text-sm text-muted-foreground">
                    {profile?.dietary_restrictions.filter(r => r !== 'None').join(", ") || "None"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meal Plan Preferences</CardTitle>
                <CardDescription>
                  Customize your meal plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Daily Calorie Target</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                      placeholder="2000"
                      min="1200"
                      max="4000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Suggested based on your fitness goal
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences">Meal Preferences</Label>
                    <Textarea
                      id="preferences"
                      placeholder="e.g., high protein, Mediterranean, quick meals, vegetarian options..."
                      value={formData.preferences}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple preferences with commas
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!formData.calories || isGenerating}
                  >
                    {isGenerating ? "Generating meal plan..." : "Generate Meal Plan"}
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