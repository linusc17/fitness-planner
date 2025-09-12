"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { 
  FITNESS_GOALS, 
  EXPERIENCE_LEVELS, 
  TIME_OPTIONS, 
  EQUIPMENT_OPTIONS, 
  DIETARY_RESTRICTIONS,
  ROUTES 
} from "@/lib/constants"

export default function Onboarding() {
  const [formData, setFormData] = useState({
    fitnessGoal: "",
    experienceLevel: "",
    availableTime: 30,
    equipment: [] as string[],
    dietaryRestrictions: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipment]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        equipment: prev.equipment.filter(e => e !== equipment)
      }))
    }
  }

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    toast.loading("Setting up your profile...", { id: "onboarding" })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const profileData = {
        fitness_goal: formData.fitnessGoal,
        experience_level: formData.experienceLevel,
        available_time: formData.availableTime,
        equipment: formData.equipment,
        dietary_restrictions: formData.dietaryRestrictions
      }

      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: user.id,
            ...profileData
          }
        ])

      if (error) {
        console.error('Error saving profile:', error)
        toast.error("Failed to save your profile. Please try again.", { id: "onboarding" })
        return
      }

      toast.success("Profile created successfully! Welcome to AI Fitness Planner.", { id: "onboarding" })
      router.push(ROUTES.DASHBOARD)
    } catch (error) {
      console.error('Error:', error)
      toast.error("Something went wrong. Please try again.", { id: "onboarding" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PageBreadcrumb />
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Let&apos;s personalize your fitness journey</h1>
            <p className="mt-2 text-muted-foreground">
              Tell us about your goals and preferences to get started
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Fitness Profile</CardTitle>
              <CardDescription>
                This information helps us create the perfect plans for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fitness-goal">What&apos;s your primary fitness goal?</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessGoal: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {FITNESS_GOALS.map(goal => (
                        <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">What&apos;s your experience level?</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">How much time can you dedicate per workout?</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, availableTime: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>What equipment do you have access to?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EQUIPMENT_OPTIONS.map(equipment => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment, checked as boolean)}
                        />
                        <Label htmlFor={equipment} className="text-sm font-normal">
                          {equipment}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Any dietary restrictions or preferences?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DIETARY_RESTRICTIONS.map(restriction => (
                      <div key={restriction} className="flex items-center space-x-2">
                        <Checkbox
                          id={restriction}
                          onCheckedChange={(checked) => handleDietaryChange(restriction, checked as boolean)}
                        />
                        <Label htmlFor={restriction} className="text-sm font-normal">
                          {restriction}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!formData.fitnessGoal || !formData.experienceLevel || isSubmitting}
                >
                  {isSubmitting ? "Setting up your profile..." : "Complete Setup"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}