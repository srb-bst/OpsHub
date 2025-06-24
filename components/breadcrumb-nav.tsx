"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href: string
}

export function BreadcrumbNav() {
  const pathname = usePathname()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/" }]

    // Define route mappings
    const routeMap: Record<string, string> = {
      leads: "Leads",
      consultations: "Consultations",
      designs: "Design Projects",
      "blue-sheets": "Blue Sheets",
      estimates: "Estimates",
      scheduling: "Job Scheduling",
      deliveries: "Deliveries",
      installations: "Installations",
      jobs: "Active Jobs",
      nursery: "Nursery",
      issues: "Issues",
      calendar: "Calendar",
      customers: "Customers",
      new: "New",
    }

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      // Don't add "New" as a separate breadcrumb, combine with parent
      if (segment === "new" && breadcrumbs.length > 1) {
        breadcrumbs[breadcrumbs.length - 1].label = `New ${breadcrumbs[breadcrumbs.length - 1].label.slice(0, -1)}`
        breadcrumbs[breadcrumbs.length - 1].href = currentPath
      } else {
        breadcrumbs.push({ label, href: currentPath })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Don't show breadcrumbs on home page or if only one item
  if (pathname === "/" || breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-slate-500 mb-4 lg:mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {index === 0 && <Home className="h-4 w-4 mr-1" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-slate-900">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className="hover:text-slate-700 transition-colors">
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
