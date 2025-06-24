"use client"

import {
  Calendar,
  Clock,
  Leaf,
  Plus,
  Shovel,
  Truck,
  Users,
  DollarSign,
  MapPin,
  ChevronRight,
  Target,
  Package,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { SmartNotifications } from "@/components/smart-notifications"
import { RecentItemsWidget } from "@/components/recent-items-widget"

export function DashboardView() {
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Command Center</h1>
            <p className="text-slate-600">{todayDate} • Your business overview at a glance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-12 px-4 text-base font-medium rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            >
              <Link href="/calendar">
                <Calendar className="mr-2 h-5 w-5" />
                View Calendar
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none w-full lg:w-auto"
            >
              <Link href="/leads/new">
                <Plus className="mr-2 h-5 w-5" />
                New Lead
              </Link>
            </Button>
          </div>
        </div>

        {/* Smart Notifications */}
        <SmartNotifications />

        {/* Key Metrics */}
        <div className="grid gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 lg:mb-8">
          <MetricCard
            title="Pipeline Value"
            value="$127,500"
            subtitle="12 active leads"
            icon={DollarSign}
            color="emerald"
            trend="+15% this month"
          />
          <MetricCard
            title="This Week"
            value="$45,000"
            subtitle="3 jobs scheduled"
            icon={Calendar}
            color="blue"
            trend="2 consultations"
          />
          <MetricCard
            title="Crew Utilization"
            value="85%"
            subtitle="4 crews active"
            icon={Users}
            color="orange"
            trend="1 crew available"
          />
          <MetricCard
            title="Completion Rate"
            value="94%"
            subtitle="On-time delivery"
            icon={Target}
            color="purple"
            trend="+2% vs last month"
          />
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Today's Operations */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none mb-6">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">Today's Operations</CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Active jobs, consultations, and deliveries
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-sm px-3 py-1 rounded-full font-medium border-0">
                    6 Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    <TodayOperationItem
                      time="8:00 AM"
                      title="Garcia Backyard Renovation"
                      type="job"
                      status="in-progress"
                      crew="Tom Wilson"
                      location="789 Pine Rd"
                      progress={40}
                      priority="high"
                    />
                    <TodayOperationItem
                      time="10:00 AM"
                      title="Thompson Consultation"
                      type="consultation"
                      status="scheduled"
                      crew="Design Team"
                      location="456 Maple St"
                      priority="medium"
                    />
                    <TodayOperationItem
                      time="1:00 PM"
                      title="Parkside Renovation"
                      type="job"
                      status="in-progress"
                      crew="Carlos Garcia"
                      location="123 Park Ave"
                      progress={60}
                      priority="medium"
                    />
                    <TodayOperationItem
                      time="2:00 PM"
                      title="Plant Delivery - Anderson"
                      type="delivery"
                      status="scheduled"
                      crew="Delivery Team"
                      location="321 Elm Ave"
                      priority="low"
                    />
                    <TodayOperationItem
                      time="3:30 PM"
                      title="Williams Design Review"
                      type="consultation"
                      status="scheduled"
                      crew="Emma Thompson"
                      location="101 Cedar Ln"
                      priority="high"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Pipeline Overview */}
            <PipelineOverview />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Items */}
            <RecentItemsWidget />

            {/* Quick Actions */}
            <QuickActionsWidget />

            {/* Crew Status */}
            <CrewStatusWidget />
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  icon: any
  color: "emerald" | "blue" | "orange" | "purple"
  trend?: string
}

function MetricCard({ title, value, subtitle, icon: Icon, color, trend }: MetricCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none p-4 lg:p-5">
      <CardHeader className="flex flex-row items-center justify-between pb-2 lg:pb-3 p-0">
        <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">{title}</CardTitle>
        <div className={`h-6 w-6 lg:h-8 lg:w-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-xl lg:text-2xl font-semibold text-slate-900 mb-1">{value}</div>
        <p className="text-xs lg:text-sm text-slate-500 mb-1">{subtitle}</p>
        {trend && <p className="text-xs text-emerald-600 font-medium">{trend}</p>}
      </CardContent>
    </Card>
  )
}

interface TodayOperationItemProps {
  time: string
  title: string
  type: "job" | "consultation" | "delivery"
  status: "scheduled" | "in-progress" | "completed"
  crew: string
  location: string
  progress?: number
  priority: "low" | "medium" | "high"
}

function TodayOperationItem({
  time,
  title,
  type,
  status,
  crew,
  location,
  progress,
  priority,
}: TodayOperationItemProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "job":
        return <Leaf className="h-4 w-4 text-emerald-600" />
      case "consultation":
        return <Shovel className="h-4 w-4 text-purple-600" />
      case "delivery":
        return <Truck className="h-4 w-4 text-orange-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700"
      case "in-progress":
        return "bg-yellow-50 text-yellow-700"
      case "completed":
        return "bg-emerald-50 text-emerald-700"
    }
  }

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col items-center min-w-[60px]">
        <Clock className="h-4 w-4 text-slate-400 mb-1" />
        <span className="text-sm font-medium text-slate-900">{time}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {getTypeIcon()}
          <h3 className="font-medium text-slate-900 truncate">{title}</h3>
          <div className={`h-2 w-2 rounded-full ${getPriorityColor()}`} />
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{crew}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {progress !== undefined && (
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-slate-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <Badge className={`${getStatusColor()} text-xs px-2 py-1 rounded-md font-medium border-0`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function PipelineOverview() {
  const pipelineData = [
    { stage: "New Leads", count: 8, value: "$42,000", color: "bg-blue-500" },
    { stage: "Qualified", count: 5, value: "$35,500", color: "bg-yellow-500" },
    { stage: "Estimated", count: 3, value: "$28,000", color: "bg-orange-500" },
    { stage: "Approved", count: 2, value: "$22,000", color: "bg-emerald-500" },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
      <CardHeader className="p-4 lg:p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Sales Pipeline</CardTitle>
            <CardDescription className="text-sm text-slate-500">Lead progression and estimated values</CardDescription>
          </div>
          <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
            <Link href="/leads">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-0">
        <div className="space-y-4">
          {pipelineData.map((stage, index) => (
            <div key={stage.stage} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                <div>
                  <p className="font-medium text-slate-900">{stage.stage}</p>
                  <p className="text-sm text-slate-500">{stage.count} projects</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{stage.value}</p>
                <p className="text-xs text-slate-500">estimated</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CrewStatusWidget() {
  const crews = [
    { name: "Mike Rodriguez", status: "available", currentJob: "Mountain View HOA", progress: 75 },
    { name: "Tom Wilson", status: "busy", currentJob: "Garcia Renovation", progress: 40 },
    { name: "Carlos Garcia", status: "available", currentJob: "Parkside Project", progress: 60 },
    { name: "James Chen", status: "available", currentJob: null, progress: 0 },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
      <CardHeader className="p-4 lg:p-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Crew Status</CardTitle>
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-xs px-2 py-1 rounded-full font-medium border-0">
            3 Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
        {crews.map((crew) => (
          <div key={crew.name} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {crew.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm text-slate-900 truncate">{crew.name}</p>
                <div
                  className={`h-2 w-2 rounded-full ${crew.status === "available" ? "bg-green-500" : "bg-yellow-500"}`}
                />
              </div>
              {crew.currentJob ? (
                <div>
                  <p className="text-xs text-slate-500 truncate mb-1">{crew.currentJob}</p>
                  <Progress value={crew.progress} className="h-1" />
                </div>
              ) : (
                <p className="text-xs text-slate-500">Available for assignment</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-4 lg:p-6 pt-3">
        <Button
          asChild
          variant="outline"
          className="w-full h-9 text-sm font-medium rounded-lg border-slate-200 hover:bg-slate-50 shadow-none"
        >
          <Link href="/scheduling">Manage Crews</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function QuickActionsWidget() {
  const actions = [
    { title: "New Lead", href: "/leads/new", icon: Plus, color: "bg-emerald-500 hover:bg-emerald-600" },
    { title: "Schedule Job", href: "/scheduling", icon: Calendar, color: "bg-blue-500 hover:bg-blue-600" },
    {
      title: "Schedule Delivery",
      href: "/scheduling?tab=deliveries",
      icon: Package,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    { title: "New Estimate", href: "/estimates/new", icon: DollarSign, color: "bg-purple-500 hover:bg-purple-600" },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
      <CardHeader className="p-4 lg:p-6 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              asChild
              className={`h-16 flex-col gap-2 text-white rounded-lg shadow-none ${action.color}`}
            >
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
