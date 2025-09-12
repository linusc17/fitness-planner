export interface UserProfile {
  id: string
  user_id: string
  fitness_goal: string
  experience_level: string
  available_time: number
  equipment: string[]
  dietary_restrictions: string[]
  created_at: string
  updated_at: string
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  description: string
}

export interface WorkoutPlan {
  id: string
  user_id: string
  plan_name: string
  exercises: Exercise[]
  duration: number
  difficulty: string
  workout_type: string
  created_at: string
}

export interface Meal {
  name: string
  calories: number
  description: string
}

export interface DayMeals {
  day: string
  meals: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snack: Meal
  }
}

export interface MealPlan {
  id: string
  user_id: string
  plan_name: string
  meals: DayMeals[]
  calories_target: number
  created_at: string
}

export interface ProgressLog {
  id: string
  user_id: string
  workout_plan_id: string
  completed_at: string
  notes?: string
  rating: number
  created_at: string
}