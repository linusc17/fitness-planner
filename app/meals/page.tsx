"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Plus, Calendar, Target } from "lucide-react"
import Link from "next/link"
import { MealPlan } from "@/types/fitness"

export default function MealPlans() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMealPlans = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setMealPlans(data)
      }
      
      setLoading(false)
    }

    fetchMealPlans()
  }, [supabase])

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
        <PageBreadcrumb />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Meal Plans</h1>
            <p className="text-muted-foreground">
              View and manage your nutrition plans
            </p>
          </div>
          <Link href="/meals/generate">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Meal Plan
            </Button>
          </Link>
        </div>

        {mealPlans.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No meal plans yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first AI-generated meal plan to support your fitness goals
              </p>
              <Link href="/meals/generate">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Your First Meal Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mealPlans.map((mealPlan) => (
              <Card key={mealPlan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{mealPlan.plan_name}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      7 days
                    </span>
                    <span>{mealPlan.calories_target} cal/day</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete weekly nutrition plan
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/meals/${mealPlan.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}