"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { Calendar, Target } from "lucide-react"
import { MealPlan } from "@/types/fitness"

export default function MealPlanDetails() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const fetchMealPlan = async () => {
      if (!params.id) return

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setMealPlan(data)
      }
      
      setLoading(false)
    }

    fetchMealPlan()
  }, [params.id, supabase])

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

  if (!mealPlan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div>Meal plan not found</div>
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
            <h1 className="text-3xl font-bold mb-2">{mealPlan.plan_name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                7 days
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {mealPlan.calories_target} cal/day
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {mealPlan.meals.map((dayPlan, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {dayPlan.day}
                    <Badge variant="secondary">
                      {Object.values(dayPlan.meals).reduce((total, meal) => total + meal.calories, 0)} cal
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Breakfast
                      </h4>
                      <div className="space-y-1">
                        <p className="font-medium">{dayPlan.meals.breakfast.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {dayPlan.meals.breakfast.calories} cal
                        </p>
                        <p className="text-sm">{dayPlan.meals.breakfast.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Lunch
                      </h4>
                      <div className="space-y-1">
                        <p className="font-medium">{dayPlan.meals.lunch.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {dayPlan.meals.lunch.calories} cal
                        </p>
                        <p className="text-sm">{dayPlan.meals.lunch.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Dinner
                      </h4>
                      <div className="space-y-1">
                        <p className="font-medium">{dayPlan.meals.dinner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {dayPlan.meals.dinner.calories} cal
                        </p>
                        <p className="text-sm">{dayPlan.meals.dinner.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Snack
                      </h4>
                      <div className="space-y-1">
                        <p className="font-medium">{dayPlan.meals.snack.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {dayPlan.meals.snack.calories} cal
                        </p>
                        <p className="text-sm">{dayPlan.meals.snack.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}