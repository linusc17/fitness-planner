import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateWorkout({
  goal,
  level,
  time,
  equipment,
  limitations,
}: {
  goal: string
  level: string
  time: number
  equipment: string[]
  limitations?: string
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Generate a personalized ${level} workout plan for:
- Fitness Goal: ${goal}
- Experience Level: ${level}
- Available Time: ${time} minutes
- Equipment: ${equipment.join(', ')}
- Any limitations: ${limitations || 'None'}

Format as JSON with this exact structure (respond with only valid JSON, no other text):
{
  "name": "Workout Name",
  "duration": ${time},
  "difficulty": "${level}",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": "12-15",
      "rest": "60 seconds",
      "description": "Brief exercise description and form tips"
    }
  ]
}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  try {
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleanText)
  } catch {
    console.error('Failed to parse JSON response:', text)
    throw new Error('Invalid JSON response from AI')
  }
}

export async function generateMealPlan({
  goal,
  restrictions,
  calories,
  preferences,
}: {
  goal: string
  restrictions: string[]
  calories: number
  preferences: string[]
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Create a 7-day Filipino meal plan focusing on traditional and popular Filipino cuisine for:
- Fitness Goal: ${goal}
- Dietary Restrictions: ${restrictions.join(', ')}
- Calorie Target: ${calories} calories per day
- Meal Preferences: ${preferences.join(', ')}

Include authentic Filipino dishes and ingredients such as:
- Rice dishes (sinangag, garlic rice, brown rice)
- Traditional proteins (adobo chicken/pork, grilled fish, tinola, sinigang)
- Filipino vegetables (kangkong, sitaw, okra, malunggay, camote tops)
- Healthy Filipino snacks (turon with banana, buko, fresh tropical fruits)
- Filipino breakfast items (tapsilog, longsilog, bangsilog variations)
- Traditional soups and stews (sinigang, tinola, nilaga)

Use locally available Filipino ingredients and cooking methods. Make meals nutritious while staying true to Filipino flavors.

Format as JSON with this exact structure (respond with only valid JSON, no other text):
{
  "name": "Filipino Weekly Meal Plan",
  "totalCalories": ${calories},
  "days": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": { "name": "Filipino breakfast name", "calories": 400, "description": "Brief description with Filipino ingredients" },
        "lunch": { "name": "Filipino lunch name", "calories": 500, "description": "Brief description with Filipino ingredients" },
        "dinner": { "name": "Filipino dinner name", "calories": 600, "description": "Brief description with Filipino ingredients" },
        "snack": { "name": "Filipino snack name", "calories": 200, "description": "Brief description with Filipino ingredients" }
      }
    }
  ]
}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  try {
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleanText)
  } catch {
    console.error('Failed to parse JSON response:', text)
    throw new Error('Invalid JSON response from AI')
  }
}