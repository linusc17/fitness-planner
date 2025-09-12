"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Activity, Calendar, Dumbbell, Plus, UtensilsCrossed, Clock } from "lucide-react"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/lib/constants"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

interface RecentActivity {
  id: string
  type: 'workout_created' | 'workout_completed' | 'meal_plan_created'
  title: string
  description: string
  created_at: string
  item_id?: string
}


export default function Dashboard() {
  const { user, loading } = useAuth(ROUTES.SIGNIN)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [activityLoading, setActivityLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return
      
      try {
        const { data: workouts } = await supabase
          .from('workout_plans')
          .select('id, plan_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3)

        const { data: progressLogs } = await supabase
          .from('progress_logs')
          .select('id, completed_at, workout_plans(plan_name, id)')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(3)

        const { data: mealPlans } = await supabase
          .from('meal_plans')
          .select('id, plan_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3)

        const activities: RecentActivity[] = []

        if (workouts) {
          workouts.forEach(workout => {
            activities.push({
              id: `workout_created_${workout.id}`,
              type: 'workout_created',
              title: 'Created workout plan',
              description: workout.plan_name,
              created_at: workout.created_at,
              item_id: workout.id
            })
          })
        }

        if (progressLogs) {
          progressLogs.forEach((log) => {
            if (log && typeof log === 'object' && 'workout_plans' in log && log.workout_plans) {
              const logData = log as Record<string, unknown>
              const workoutPlans = logData.workout_plans as Record<string, unknown>
              
              if (workoutPlans && typeof workoutPlans === 'object' && 'plan_name' in workoutPlans && 'id' in workoutPlans) {
                activities.push({
                  id: `workout_completed_${String(logData.id)}`,
                  type: 'workout_completed',
                  title: 'Completed workout',
                  description: String(workoutPlans.plan_name),
                  created_at: String(logData.completed_at),
                  item_id: String(workoutPlans.id)
                })
              }
            }
          })
        }

        if (mealPlans) {
          mealPlans.forEach(meal => {
            activities.push({
              id: `meal_created_${meal.id}`,
              type: 'meal_plan_created',
              title: 'Created meal plan',
              description: meal.plan_name,
              created_at: meal.created_at,
              item_id: meal.id
            })
          })
        }

        activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setRecentActivity(activities.slice(0, 5))
      } catch (error) {
        console.error('Error fetching activity:', error)
      } finally {
        setActivityLoading(false)
      }
    }

    fetchRecentActivity()
  }, [user, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <DashboardSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <CardTitle>Workouts</CardTitle>
              </div>
              <CardDescription>
                Generate and track your workout routines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/workouts">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workout
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <CardTitle>Meal Plans</CardTitle>
              </div>
              <CardDescription>
                AI-powered nutrition planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meals">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Meal Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <CardTitle>Progress</CardTitle>
              </div>
              <CardDescription>
                Track your fitness journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/progress">
                <Button variant="outline" className="w-full group-hover:border-primary/30 transition-colors">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              {activityLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.type === 'workout_created' ? Dumbbell 
                               : activity.type === 'workout_completed' ? Activity 
                               : UtensilsCrossed
                    
                    const getActivityLink = () => {
                      if (activity.type === 'meal_plan_created') return `/meals/${activity.item_id}`
                      return `/workouts/${activity.item_id}`
                    }

                    return (
                      <Link key={activity.id} href={getActivityLink()} className="block">
                        <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-foreground">
                                {activity.title}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {activity.type === 'workout_created' ? 'Workout' 
                                   : activity.type === 'workout_completed' ? 'Completed' 
                                   : 'Meal Plan'}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(activity.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">
                    Start by creating your first workout or meal plan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}