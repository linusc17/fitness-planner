import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateMealPlan } from '@/lib/ai'
import { mealPlanGenerationSchema, mealPlanResponseSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const validatedData = mealPlanGenerationSchema.parse(body)
    const { goal, restrictions, calories, preferences } = validatedData

    const mealPlan = await generateMealPlan({
      goal,
      restrictions,
      calories,
      preferences
    })

    const validatedMealPlan = mealPlanResponseSchema.parse(mealPlan)

    const { data, error } = await supabase
      .from('meal_plans')
      .insert([
        {
          user_id: user.id,
          plan_name: validatedMealPlan.name,
          meals: validatedMealPlan.days,
          calories_target: validatedMealPlan.totalCalories
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save meal plan' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}