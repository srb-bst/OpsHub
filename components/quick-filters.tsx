"use client"

import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface QuickFilter {
  id: string
  label: string
  count?: number
  active?: boolean
}

interface QuickFiltersProps {
  filters: QuickFilter[]
  onFilterChange: (filterId: string) => void
  onClearAll: () => void
  className?: string
}

export function QuickFilters({ filters, onFilterChange, onClearAll, className = "" }: QuickFiltersProps) {
  const activeFilters = filters.filter((f) => f.active)

  return (
    <Card className={`bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Quick Filters</span>
          </div>
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 text-xs">
              Clear All
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={filter.active ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className={`h-8 px-3 text-xs rounded-lg font-medium ${
                filter.active ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              {filter.label}
              {filter.count !== undefined && (
                <Badge
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium border-0 ${
                    filter.active ? "bg-emerald-400 text-emerald-900" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {filter.count}
                </Badge>
              )}
              {filter.active && <X className="ml-1 h-3 w-3" />}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined filter sets for different modules
export const leadFilters: QuickFilter[] = [
  { id: "high-priority", label: "High Priority", count: 5 },
  { id: "new", label: "New Leads", count: 8 },
  { id: "overdue", label: "Overdue Follow-up", count: 3 },
  { id: "this-week", label: "This Week", count: 12 },
  { id: "assigned-to-me", label: "Assigned to Me", count: 6 },
]

export const projectFilters: QuickFilter[] = [
  { id: "in-progress", label: "In Progress", count: 4 },
  { id: "ready-estimate", label: "Ready for Estimate", count: 2 },
  { id: "high-value", label: "High Value ($20K+)", count: 3 },
  { id: "this-month", label: "This Month", count: 15 },
]

export const deliveryFilters: QuickFilter[] = [
  { id: "today", label: "Today", count: 4 },
  { id: "this-week", label: "This Week", count: 12 },
  { id: "urgent", label: "Urgent", count: 2 },
  { id: "my-route", label: "My Route", count: 6 },
]
