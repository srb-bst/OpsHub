"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface SimplifiedCardProps {
  title: string
  subtitle: string
  status?: {
    label: string
    color: string
  }
  priority?: "low" | "medium" | "high"
  value?: string
  href: string
  actions?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline"
  }[]
  metadata?: string[]
}

export function SimplifiedCard({
  title,
  subtitle,
  status,
  priority,
  value,
  href,
  actions = [],
  metadata = [],
}: SimplifiedCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none hover:bg-white transition-all group">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={href}
                className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors truncate group-hover:text-emerald-600"
              >
                {title}
              </Link>
              {priority && <div className={`h-2 w-2 rounded-full flex-shrink-0 ${getPriorityColor(priority)}`} />}
            </div>
            <p className="text-sm text-slate-600 truncate">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {value && <span className="text-lg font-semibold text-emerald-600">{value}</span>}
            {status && (
              <Badge className={`${status.color} text-xs px-2 py-1 rounded-md font-medium border-0`}>
                {status.label}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>

        {metadata.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 text-xs text-slate-500">
            {metadata.slice(0, 3).map((item, index) => (
              <span key={index} className="truncate">
                {item}
                {index < Math.min(metadata.length - 1, 2) && " •"}
              </span>
            ))}
            {metadata.length > 3 && <span>+{metadata.length - 3} more</span>}
          </div>
        )}

        {actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {actions.slice(0, 2).map((action, index) => (
              <Button
                key={index}
                asChild={!!action.href}
                size="sm"
                variant={action.variant || "outline"}
                className="h-8 px-3 text-xs rounded-lg"
                onClick={action.onClick}
              >
                {action.href ? <Link href={action.href}>{action.label}</Link> : <span>{action.label}</span>}
              </Button>
            ))}
            {actions.length > 2 && (
              <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                +{actions.length - 2}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
