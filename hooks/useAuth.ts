"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth(redirectTo?: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      setUser(user)
      setLoading(false)

      if (!user && redirectTo) {
        router.push(redirectTo)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      
      if (!session?.user && redirectTo) {
        router.push(redirectTo)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router, redirectTo])

  return { user, loading }
}