"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  User,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  Palette,
  Camera,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"

interface EnhancedDesignProject {
  id: string
  customer_name: string
  customer_phone?: string
  customer_email?: string
  customer_address?: string
  title: string
  status: string
  project_type: string
  area: string
  priority: string
  designer_name?: string
  designer_initials?: string
  consultation_date?: string
  consultation_status?: string
  completion_percentage: number
  photos_count: number
  notes_count: number
  estimated_value?: string
  services: string[]
  created_at: string
  updated_at: string
  follow_up_required: boolean
  follow_up_date?: string
}

export function EnhancedDesignList() {
  const [designs, setDesigns] = useState<EnhancedDesignProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from("design_projects")
        .select("*")
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching designs:", error)
        return
      }

      setDesigns(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "consultation-scheduled":
        return "bg-purple-100 text-purple-700"
      case "consultation-complete":
        return "bg-indigo-100 text-indigo-700"
      case "ready-for-estimate":
        return "bg-orange-100 text-orange-700"
      case "needs-estimate":
        return "bg-orange-100 text-orange-700"
      case "pending-approval":
        return "bg-yellow-100 text-yellow-700"
      case "approved":
        return "bg-green-100 text-green-700"
      case "on-hold":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />
      case "in-progress":
        return <CircleDashed className="h-4 w-4" />
      case "consultation-scheduled":
        return <Calendar className="h-4 w-4" />
      default:
        return <CircleDashed className="h-4 w-4" />
    }
  }

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

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch =
      (design.customer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (design.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (design.customer_address?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || design.status === statusFilter
    const matchesPriority = priorityFilter === "all" || design.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const groupedDesigns = {
    active: filteredDesigns.filter((d) => ["draft", "in-progress", "consultation-scheduled"].includes(d.status)),
    consultation: filteredDesigns.filter((d) => ["consultation-scheduled", "consultation-complete"].includes(d.status)),
    "ready-estimate": filteredDesigns.filter((d) => ["ready-for-estimate", "needs-estimate"].includes(d.status)),
    approved: filteredDesigns.filter((d) => ["approved"].includes(d.status)),
    "on-hold": filteredDesigns.filter((d) => ["on-hold"].includes(d.status)),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading design projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Design Projects</h1>
            <p className="text-slate-600">Manage design projects from consultation to completion</p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none w-full lg:w-auto"
          >
            <Link href="/designs/new">
              <Plus className="mr-2 h-5 w-5" />
              New Design Project
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[160px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="consultation-scheduled">Consultation Scheduled</SelectItem>
                <SelectItem value="consultation-complete">Consultation Complete</SelectItem>
                <SelectItem value="ready-for-estimate">Ready for Estimate</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[140px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-2 lg:grid-cols-5">
            <TabsTrigger
              value="active"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Active ({groupedDesigns.active.length})
            </TabsTrigger>
            <TabsTrigger
              value="consultation"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Consultation ({groupedDesigns.consultation.length})
            </TabsTrigger>
            <TabsTrigger
              value="ready-estimate"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Ready ({groupedDesigns["ready-estimate"].length})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Approved ({groupedDesigns.approved.length})
            </TabsTrigger>
            <TabsTrigger
              value="on-hold"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              On Hold ({groupedDesigns["on-hold"].length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(groupedDesigns).map(([key, designs]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="grid gap-4">
                {designs.map((design) => (
                  <DesignProjectCard
                    key={design.id}
                    design={design}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
                {designs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No design projects in this category</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

interface DesignProjectCardProps {
  design: EnhancedDesignProject
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => JSX.Element
  getPriorityColor: (priority: string) => string
}

function DesignProjectCard({ design, getStatusColor, getStatusIcon, getPriorityColor }: DesignProjectCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none hover:bg-white transition-all">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Palette className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900">{design.title || "Untitled Project"}</h3>
                <div className={`h-2 w-2 rounded-full ${getPriorityColor(design.priority)}`}></div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <User className="h-3 w-3" />
                <span>{design.customer_name || "Unknown Customer"}</span>
                {design.customer_phone && (
                  <>
                    <span>•</span>
                    <Phone className="h-3 w-3" />
                    <span>{design.customer_phone}</span>
                  </>
                )}
              </div>
              {design.customer_address && (
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{design.customer_address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={`${getStatusColor(design.status)} text-sm px-3 py-1 rounded-full font-medium border-0 flex items-center gap-1`}
            >
              {getStatusIcon(design.status)}
              {design.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <span className="text-slate-500">Type:</span>
            <span className="ml-2 text-slate-900 capitalize">{design.project_type}</span>
          </div>
          <div>
            <span className="text-slate-500">Area:</span>
            <span className="ml-2 text-slate-900">{design.area}</span>
          </div>
          {design.estimated_value && (
            <div>
              <span className="text-slate-500">Est. Value:</span>
              <span className="ml-2 text-slate-900 font-medium">{design.estimated_value}</span>
            </div>
          )}
          {design.consultation_date && (
            <div>
              <span className="text-slate-500">Consultation:</span>
              <span className="ml-2 text-slate-900">{new Date(design.consultation_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Services */}
        {design.services && Array.isArray(design.services) && design.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {design.services.map((service, index) => (
              <Badge
                key={index}
                className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
              >
                {service}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {design.completion_percentage > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Progress:</span>
                <Progress value={design.completion_percentage} className="w-20 h-2" />
                <span className="text-xs text-slate-600">{design.completion_percentage}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {design.photos_count > 0 && (
              <div className="flex items-center gap-1">
                <Camera className="h-3 w-3" />
                <span>{design.photos_count}</span>
              </div>
            )}
            {design.notes_count > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{design.notes_count}</span>
              </div>
            )}
          </div>
        </div>

        {/* Designer Assignment */}
        {design.designer_name && (
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{design.designer_initials || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-slate-600">Assigned to {design.designer_name}</span>
          </div>
        )}

        {/* Follow-up Alert */}
        {design.follow_up_required && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg mb-4">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              Follow-up required
              {design.follow_up_date && ` by ${new Date(design.follow_up_date).toLocaleDateString()}`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">Updated {new Date(design.updated_at).toLocaleDateString()}</div>
          <div className="flex items-center gap-2">
            {design.status === "consultation-scheduled" && (
              <Button size="sm" className="h-8 px-3 text-xs bg-purple-500 hover:bg-purple-600 rounded-lg">
                Start Consultation
              </Button>
            )}
            {design.status === "consultation-complete" && (
              <Button size="sm" className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 rounded-lg">
                Create Estimate
              </Button>
            )}
            {design.status === "ready-for-estimate" && (
              <Button asChild size="sm" className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                <Link href={`/estimates/new?design=${design.id}`}>Create Estimate</Link>
              </Button>
            )}
            {design.status === "approved" && (
              <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
                <Link href="/scheduling">Schedule Project</Link>
              </Button>
            )}
            <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
              <Link href={`/designs/${design.id}`}>
                View Details
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
