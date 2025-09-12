import { z } from 'zod'

export const userProfileSchema = z.object({
  fitness_goal: z.enum(['Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'General Fitness', 'Flexibility']),
  experience_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  available_time: z.number().min(15).max(180),
  equipment: z.array(z.string()).max(10),
  dietary_restrictions: z.array(z.string()).max(10)
})

export const workoutGenerationSchema = z.object({
  goal: z.string().min(1).max(50),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  time: z.number().min(15).max(180),
  equipment: z.array(z.string().min(1).max(50)).max(10),
  limitations: z.string().max(500).optional(),
  workoutType: z.string().min(1).max(50)
})

export const mealPlanGenerationSchema = z.object({
  goal: z.string().min(1).max(50),
  restrictions: z.array(z.string().max(50)).max(10),
  calories: z.number().min(1200).max(4000),
  preferences: z.array(z.string().max(100)).max(20)
})

export const progressLogSchema = z.object({
  workout_plan_id: z.string().uuid(),
  completed_at: z.string().datetime(),
  notes: z.string().max(500).optional(),
  rating: z.number().min(1).max(5)
})

export const exerciseSchema = z.object({
  name: z.string().min(1).max(100),
  sets: z.number().min(1).max(10),
  reps: z.union([z.string(), z.number()]).transform(val => String(val)).pipe(z.string().min(1).max(50)),
  rest: z.string().min(1).max(50),
  description: z.string().min(1).max(500)
})

export const workoutPlanSchema = z.object({
  name: z.string().min(1).max(100),
  duration: z.number().min(15).max(180),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  exercises: z.array(exerciseSchema).min(1).max(20)
})

export const mealSchema = z.object({
  name: z.string().min(1).max(100),
  calories: z.number().min(0).max(2000),
  description: z.string().min(1).max(300)
})

export const dayMealsSchema = z.object({
  day: z.string().min(1).max(20),
  meals: z.object({
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    snack: mealSchema
  })
})

export const mealPlanResponseSchema = z.object({
  name: z.string().min(1).max(100),
  totalCalories: z.number().min(1200).max(4000),
  days: z.array(dayMealsSchema).length(7)
})