"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

interface BreadcrumbSegment {
  label: string
  href: string
  isCurrentPage?: boolean
}

export function PageBreadcrumb() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    const breadcrumbs: BreadcrumbSegment[] = [
      { label: 'Dashboard', href: '/dashboard' }
    ]
    
    let currentPath = ''
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      if (currentPath === '/dashboard') return
      
      let label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      
      if (segment === 'generate' && pathSegments[index - 1] === 'workouts') {
        label = 'Generate Workout'
      } else if (segment === 'generate' && pathSegments[index - 1] === 'meals') {
        label = 'Generate Meal Plan'
      } else if (segment === 'workouts') {
        label = 'Workouts'
      } else if (segment === 'meals') {
        label = 'Meal Plans'
      } else if (segment === 'onboarding') {
        label = 'Setup Profile'
      } else if (segment === 'progress') {
        label = 'Progress'
      } else if (pathSegments[index - 1] === 'workouts' && segment.length > 10) {
        label = 'Workout Details'
      } else if (pathSegments[index - 1] === 'meals' && segment.length > 10) {
        label = 'Meal Plan Details'
      }
      
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: isLast
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/signin')) {
    return null
  }
  
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbs.slice(1).map((crumb) => (
          <div key={crumb.href} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isCurrentPage ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}