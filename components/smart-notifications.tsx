"use client"

import { useState } from "react"
import { AlertTriangle, Clock, CheckCircle, X, Bell, Calendar, Users, Package } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  type: "urgent" | "warning" | "info" | "success"
  title: string
  message: string
  action?: {
    label: string
    href: string
  }
  timestamp: string
  count?: number
  icon?: any
}

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "urgent",
      title: "Jobs Need Scheduling",
      message: "3 approved projects are waiting to be scheduled",
      action: { label: "Schedule Now", href: "/scheduling?filter=approved" },
      timestamp: "5 minutes ago",
      count: 3,
      icon: Calendar,
    },
    {
      id: "2",
      type: "warning",
      title: "Overdue Follow-ups",
      message: "2 leads haven't been contacted in 48+ hours",
      action: { label: "Follow Up", href: "/leads?filter=overdue" },
      timestamp: "1 hour ago",
      count: 2,
      icon: Users,
    },
    {
      id: "3",
      type: "info",
      title: "Deliveries Today",
      message: "4 deliveries scheduled for today",
      action: { label: "View Schedule", href: "/deliveries" },
      timestamp: "2 hours ago",
      count: 4,
      icon: Package,
    },
    {
      id: "4",
      type: "warning",
      title: "Nursery Issues",
      message: "2 high-priority plant health issues need attention",
      action: { label: "Review Issues", href: "/nursery/issues" },
      timestamp: "3 hours ago",
      count: 2,
      icon: AlertTriangle,
    },
  ])

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-l-red-500 bg-red-50/50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50/50"
      case "info":
        return "border-l-blue-500 bg-blue-50/50"
      case "success":
        return "border-l-emerald-500 bg-emerald-50/50"
      default:
        return "border-l-slate-300"
    }
  }

  const getNotificationIcon = (type: string, customIcon?: any) => {
    if (customIcon) {
      const Icon = customIcon
      return <Icon className="h-5 w-5" />
    }

    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Bell className="h-5 w-5 text-blue-600" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      default:
        return <Bell className="h-5 w-5 text-slate-600" />
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 mb-6">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`border-l-4 ${getNotificationStyle(notification.type)} bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type, notification.icon)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                  {notification.count && (
                    <Badge
                      className={`${
                        notification.type === "urgent"
                          ? "bg-red-100 text-red-800"
                          : notification.type === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      } text-xs px-2 py-1 rounded-full font-medium border-0`}
                    >
                      {notification.count}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{notification.timestamp}</span>
                  {notification.action && (
                    <Button asChild size="sm" className="h-8 px-3 text-xs">
                      <Link href={notification.action.href}>{notification.action.label}</Link>
                    </Button>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-slate-100 rounded-full flex-shrink-0"
                onClick={() => dismissNotification(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
