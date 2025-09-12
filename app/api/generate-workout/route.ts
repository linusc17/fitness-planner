import { NextRequest, NextResponse } from 'next/server'
import { generateWorkout } from '@/lib/ai'
import { workoutGenerationSchema, workoutPlanSchema } from '@/lib/validations'
import { ZodError } from 'zod'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    console.log('API route hit - generating workout for user:', user.id)

    const body = await request.json()
    
    const validatedData = workoutGenerationSchema.parse(body)
    const { goal, level, time, equipment, limitations, workoutType } = validatedData

    console.log('Generating workout with params:', { goal, level, time, equipment, limitations })
    
    const workoutPlan = await generateWorkout({
      goal,
      level,
      time,
      equipment,
      limitations
    })

    console.log('Generated workout plan:', workoutPlan)
    
    const validatedWorkoutPlan = workoutPlanSchema.parse(workoutPlan)

    const workoutData = {
      user_id: user.id,
      plan_name: validatedWorkoutPlan.name,
      exercises: validatedWorkoutPlan.exercises,
      duration: validatedWorkoutPlan.duration,
      difficulty: validatedWorkoutPlan.difficulty,
      workout_type: workoutType,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('workout_plans')
      .insert([workoutData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        id: 'temp-id-' + Date.now(),
        ...workoutData
      })
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