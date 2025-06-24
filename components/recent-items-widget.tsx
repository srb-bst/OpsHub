"use client"

import { useState, useEffect } from "react"
import { Clock, FileText, Users, DollarSign, Package, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RecentItem {
  id: string
  title: string
  subtitle: string
  type: "lead" | "blue-sheet" | "estimate" | "delivery" | "customer"
  href: string
  timestamp: string
  status?: string
}

export function RecentItemsWidget() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])

  // Mock recent items - in real app, this would come from localStorage or API
  useEffect(() => {
    const mockItems: RecentItem[] = [
      {
        id: "1",
        title: "Sarah Johnson",
        subtitle: "Lead - High Priority",
        type: "lead",
        href: "/leads",
        timestamp: "2 minutes ago",
        status: "new",
      },
      {
        id: "2",
        title: "Garcia Renovation",
        subtitle: "Blue Sheet - In Progress",
        type: "blue-sheet",
        href: "/blue-sheets/2",
        timestamp: "15 minutes ago",
        status: "in-progress",
      },
      {
        id: "3",
        title: "EST-2025-001",
        subtitle: "Estimate - $15,500",
        type: "estimate",
        href: "/estimates/1",
        timestamp: "1 hour ago",
        status: "sent",
      },
      {
        id: "4",
        title: "Plant Delivery",
        subtitle: "DEL-001 - Scheduled",
        type: "delivery",
        href: "/deliveries",
        timestamp: "2 hours ago",
        status: "scheduled",
      },
    ]
    setRecentItems(mockItems)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lead":
        return <Users className="h-4 w-4 text-blue-600" />
      case "blue-sheet":
        return <FileText className="h-4 w-4 text-purple-600" />
      case "estimate":
        return <DollarSign className="h-4 w-4 text-emerald-600" />
      case "delivery":
        return <Package className="h-4 w-4 text-orange-600" />
      default:
        return <FileText className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "sent":
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  if (recentItems.length === 0) {
    return null
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
      <CardHeader className="p-4 lg:p-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Items
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
        {recentItems.map((item) => (
          <Link key={item.id} href={item.href} className="block">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
              <div className="flex-shrink-0">{getTypeIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-slate-900 truncate">{item.title}</p>
                  {item.status && (
                    <Badge
                      className={`${getStatusColor(item.status)} text-xs px-2 py-1 rounded-md font-medium border-0`}
                    >
                      {item.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 truncate">{item.subtitle}</p>
                <p className="text-xs text-slate-400">{item.timestamp}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
