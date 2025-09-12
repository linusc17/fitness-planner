export const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Endurance",
  "Strength",
  "General Fitness",
  "Flexibility"
] as const

export const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const

export const TIME_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" }
] as const

export const EQUIPMENT_OPTIONS = [
  "Bodyweight only",
  "Dumbbells",
  "Resistance bands",
  "Pull-up bar",
  "Full gym access",
  "Yoga mat",
  "Kettlebells"
] as const

export const DIETARY_RESTRICTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Keto",
  "Paleo",
  "Low-carb"
] as const

export const WORKOUT_TYPES = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Flexibility/Yoga",
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Core"
] as const

export const CALORIE_TARGETS = {
  'Weight Loss': 1800,
  'Muscle Gain': 2500,
  'Endurance': 2200,
  'Strength': 2300,
  'General Fitness': 2000,
  'Flexibility': 1900
} as const

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  DASHBOARD: '/dashboard',
  ONBOARDING: '/onboarding',
  WORKOUTS: '/workouts',
  MEALS: '/meals',
  PROGRESS: '/progress'
} as const