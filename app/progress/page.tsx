"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Activity, Calendar, Trophy, TrendingUp } from "lucide-react"
import { ProgressLog, WorkoutPlan } from "@/types/fitness"

interface ProgressWithWorkout extends ProgressLog {
  workout_plans: WorkoutPlan
}

export default function Progress() {
  const [progressLogs, setProgressLogs] = useState<ProgressWithWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('progress_logs')
        .select(`
          *,
          workout_plans (
            plan_name,
            duration,
            difficulty,
            workout_type
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (!error && data) {
        setProgressLogs(data as ProgressWithWorkout[])
      }
      
      setLoading(false)
    }

    fetchProgress()
  }, [supabase])

  const totalWorkouts = progressLogs.length
  const totalMinutes = progressLogs.reduce((sum, log) => sum + (log.workout_plans?.duration || 0), 0)
  const averageRating = totalWorkouts > 0 
    ? progressLogs.reduce((sum, log) => sum + log.rating, 0) / totalWorkouts 
    : 0

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
        <PageBreadcrumb />
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your fitness journey and achievements
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">
                Completed sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalMinutes / 60)}h</div>
              <p className="text-xs text-muted-foreground">
                {totalMinutes} minutes total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Out of 5 stars
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Days in a row
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your completed workouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progressLogs.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No workouts completed yet</p>
                <p className="text-sm text-muted-foreground">
                  Complete your first workout to see your progress here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{log.workout_plans?.plan_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.workout_plans?.duration} minutes • {log.workout_plans?.difficulty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(log.completed_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ⭐ {log.rating}/5
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}