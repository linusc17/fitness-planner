"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Clock, Target, CheckCircle } from "lucide-react"
import { WorkoutPlan } from "@/types/fitness"

export default function WorkoutDetails() {
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!params.id) return

      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setWorkout(data)
      }
      
      setLoading(false)
    }

    fetchWorkout()
  }, [params.id, supabase])

  const handleCompleteWorkout = async () => {
    if (!workout) return

    setCompleting(true)
    toast.loading("Completing workout...", { id: "complete-workout" })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { error } = await supabase
        .from('progress_logs')
        .insert([
          {
            user_id: user.id,
            workout_plan_id: workout.id,
            completed_at: new Date().toISOString(),
            rating: 5
          }
        ])

      if (!error) {
        toast.success("Great job! Workout completed successfully! 🎉", { id: "complete-workout" })
        router.push('/progress')
      } else {
        toast.error("Failed to save your progress. Please try again.", { id: "complete-workout" })
      }
    } catch (error) {
      console.error('Error completing workout:', error)
      toast.error("Something went wrong. Please try again.", { id: "complete-workout" })
    } finally {
      setCompleting(false)
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

  if (!workout) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div>Workout not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <PageBreadcrumb />

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{workout.plan_name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {workout.duration} minutes
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {workout.difficulty}
              </span>
              <Badge variant="secondary">{workout.workout_type}</Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Exercises</CardTitle>
                  <CardDescription>
                    Complete each exercise as described
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{exercise.name}</h3>
                          <Badge variant="outline">{index + 1}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Sets:</span>
                            <p className="font-semibold">{exercise.sets}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Reps:</span>
                            <p className="font-semibold">{exercise.reps}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Rest:</span>
                            <p className="font-semibold">{exercise.rest}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Workout Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Exercises</p>
                    <p className="text-2xl font-bold">{workout.exercises.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Duration</p>
                    <p className="text-2xl font-bold">{workout.duration} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="text-lg font-semibold capitalize">{workout.difficulty}</p>
                  </div>
                  <Button
                    onClick={handleCompleteWorkout}
                    disabled={completing}
                    className="w-full mt-6"
                    size="lg"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {completing ? "Completing..." : "Mark as Complete"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}