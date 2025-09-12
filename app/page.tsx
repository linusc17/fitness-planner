import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Activity, Target, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your AI-Powered
            <span className="block text-primary">Fitness Journey</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Get personalized workout routines and meal plans tailored to your goals, 
            experience level, and available equipment.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signin">
              <Button size="lg" className="text-base">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-base">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div id="features" className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 transition-colors group-hover:bg-primary/20">
                <Target className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              </div>
              <CardTitle className="text-lg">Personalized Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-generated workouts and meals based on your specific goals and preferences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 transition-colors group-hover:bg-primary/20">
                <Activity className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              </div>
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your fitness journey with detailed analytics and improvement insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 transition-colors group-hover:bg-primary/20">
                <Zap className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              </div>
              <CardTitle className="text-lg">Adaptive Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plans that evolve with your progress and adapt to your available equipment.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 transition-colors group-hover:bg-primary/20">
                <Users className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              </div>
              <CardTitle className="text-lg">All Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                From beginners to advanced athletes, get plans that match your experience.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
