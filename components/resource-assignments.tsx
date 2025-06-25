"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, CheckCircle2, BarChart3, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

interface Designer {
  id: string
  name: string
  initials: string
  email: string
  active_projects: number
  completed_this_month: number
  avg_completion_time: number
  workload_percentage: number
  specialties: string[]
  status: "available" | "busy" | "overloaded"
}

interface Assignment {
  id: string
  project_title: string
  customer_name: string
  designer_name: string
  designer_initials: string
  status: string
  priority: string
  assigned_date: string
  due_date?: string
  completion_percentage: number
  estimated_value?: string
}

export function ResourceAssignments() {
  const [designers, setDesigners] = useState<Designer[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResourceData()
  }, [])

  const fetchResourceData = async () => {
    try {
      // Fetch design projects with designer assignments
      const { data: projects, error: projectsError } = await supabase
        .from("design_projects")
        .select("*")
        .not("designer_name", "is", null)
        .order("updated_at", { ascending: false })

      if (projectsError) {
        console.error("Error fetching projects:", projectsError)
        return
      }

      // Process assignments
      const assignmentData: Assignment[] =
        projects?.map((project) => ({
          id: project.id,
          project_title: project.title,
          customer_name: project.customer_name,
          designer_name: project.designer_name,
          designer_initials: project.designer_initials || "?",
          status: project.status,
          priority: project.priority || "medium",
          assigned_date: project.created_at,
          completion_percentage: project.completion_percentage || 0,
          estimated_value: project.estimated_value,
        })) || []

      setAssignments(assignmentData)

      // Generate designer summary data
      const designerMap = new Map()
      assignmentData.forEach((assignment) => {
        const designerName = assignment.designer_name
        if (!designerMap.has(designerName)) {
          designerMap.set(designerName, {
            name: designerName,
            initials: assignment.designer_initials,
            active_projects: 0,
            completed_this_month: 0,
            assignments: [],
          })
        }
        designerMap.get(designerName).assignments.push(assignment)
        if (!["completed", "approved"].includes(assignment.status)) {
          designerMap.get(designerName).active_projects++
        }
      })

      const designerData: Designer[] = Array.from(designerMap.values()).map((designer, index) => ({
        id: `designer-${index}`,
        name: designer.name,
        initials: designer.initials,
        email: `${designer.name.toLowerCase().replace(" ", ".")}@company.com`,
        active_projects: designer.active_projects,
        completed_this_month: Math.floor(Math.random() * 5) + 1,
        avg_completion_time: Math.floor(Math.random() * 10) + 5,
        workload_percentage: Math.min((designer.active_projects / 8) * 100, 100),
        specialties: ["Residential", "Commercial"][Math.floor(Math.random() * 2)]
          ? ["Residential Design", "Landscape Architecture"]
          : ["Commercial Projects", "Hardscaping"],
        status: designer.active_projects > 6 ? "overloaded" : designer.active_projects > 3 ? "busy" : "available",
      }))

      setDesigners(designerData)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700"
      case "busy":
        return "bg-yellow-100 text-yellow-700"
      case "overloaded":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading resource assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Design Assignments</h1>
            <p className="text-slate-600">Manage designer workloads and project assignments</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6">
            <TabsTrigger
              value="overview"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Designer Overview
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Active Assignments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 lg:grid-cols-4">
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total Designers</p>
                      <p className="text-2xl font-semibold text-slate-900">{designers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Active Projects</p>
                      <p className="text-2xl font-semibold text-slate-900">{assignments.length}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Avg Workload</p>
                      <p className="text-2xl font-semibold text-slate-900">
                        {Math.round(designers.reduce((acc, d) => acc + d.workload_percentage, 0) / designers.length)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Available</p>
                      <p className="text-2xl font-semibold text-slate-900">
                        {designers.filter((d) => d.status === "available").length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Designer Cards */}
            <div className="grid gap-4 lg:grid-cols-2">
              {designers.map((designer) => (
                <Card
                  key={designer.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{designer.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{designer.name}</CardTitle>
                          <p className="text-sm text-slate-600">{designer.email}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(designer.status)} border-0 capitalize`}>
                        {designer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-4">
                      {/* Workload */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600">Current Workload</span>
                          <span className="text-sm font-medium">{designer.workload_percentage}%</span>
                        </div>
                        <Progress value={designer.workload_percentage} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{designer.active_projects}</p>
                          <p className="text-xs text-slate-600">Active Projects</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{designer.completed_this_month}</p>
                          <p className="text-xs text-slate-600">Completed</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{designer.avg_completion_time}d</p>
                          <p className="text-xs text-slate-600">Avg Time</p>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {designer.specialties.map((specialty, index) => (
                            <Badge
                              key={index}
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md border-0"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                          View Projects
                        </Button>
                        <Button size="sm" className="flex-1 h-8 text-xs bg-emerald-500 hover:bg-emerald-600">
                          Assign Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{assignment.designer_initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{assignment.project_title}</h3>
                          <p className="text-sm text-slate-600 mb-2">Customer: {assignment.customer_name}</p>
                          <p className="text-sm text-slate-600">Assigned to: {assignment.designer_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getPriorityColor(assignment.priority)} text-xs border-0 capitalize`}>
                          {assignment.priority}
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-700 text-xs border-0 capitalize">
                          {assignment.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Assigned {new Date(assignment.assigned_date).toLocaleDateString()}</span>
                        </div>
                        {assignment.completion_percentage > 0 && (
                          <div className="flex items-center gap-2">
                            <Progress value={assignment.completion_percentage} className="w-16 h-2" />
                            <span>{assignment.completion_percentage}%</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {assignment.estimated_value && (
                          <span className="text-sm font-medium text-emerald-600">{assignment.estimated_value}</span>
                        )}
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                          View Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
