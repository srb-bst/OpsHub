"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, MapPin, Phone, Filter, RefreshCw, ExternalLink, Plus, Truck, AlertTriangle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ApprovedProject {
  id: string
  customerName: string
  address: string
  phone: string
  services: string[]
  estimatedValue: string
  estimatedDuration: string
  priority: "low" | "medium" | "high"
  approvedDate: string
  preferredStartDate?: string
  specialRequirements?: string
  outlookEventId?: string
  status: "approved" | "scheduled" | "in-progress" | "completed" | "on-hold"
  scheduledDate?: string
  assignedCrew?: string
  completionPercentage?: number
  blueSheetId: string
  estimateId: string
}

interface CrewMember {
  id: string
  name: string
  initials: string
  role: string
  team?: string
  skills: string[]
  availability: "available" | "busy" | "unavailable"
  currentJobs: number
  maxJobs: number
}

const allProjects: ApprovedProject[] = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    address: "123 Oak Street, Springfield",
    phone: "(555) 123-4567",
    services: ["Design", "Installation"],
    estimatedValue: "$15,500",
    estimatedDuration: "3 days",
    priority: "high",
    approvedDate: "June 15, 2025",
    preferredStartDate: "ASAP",
    status: "approved",
    blueSheetId: "BS-2025-005",
    estimateId: "EST-2025-005",
    specialRequirements: "Customer prefers morning start times. Small backyard access.",
  },
  {
    id: "2",
    customerName: "Jennifer Martinez",
    address: "789 Pine Road, Springfield",
    phone: "(555) 345-6789",
    services: ["Design", "Hardscape", "Installation"],
    estimatedValue: "$35,000",
    estimatedDuration: "7 days",
    priority: "high",
    approvedDate: "June 12, 2025",
    preferredStartDate: "Within 2 weeks",
    status: "approved",
    blueSheetId: "BS-2025-006",
    estimateId: "EST-2025-006",
    specialRequirements: "Large project requiring excavator access. Customer travels frequently.",
  },
  {
    id: "3",
    customerName: "Robert Thompson",
    address: "456 Maple Avenue, Springfield",
    phone: "(555) 567-8901",
    services: ["Installation", "Tree Services"],
    estimatedValue: "$22,000",
    estimatedDuration: "4 days",
    priority: "medium",
    approvedDate: "June 10, 2025",
    preferredStartDate: "July 1st",
    status: "approved",
    blueSheetId: "BS-2025-007",
    estimateId: "EST-2025-007",
    specialRequirements: "Coordinate with HOA for tree removal permits.",
  },
  {
    id: "4",
    customerName: "Mountain View HOA",
    address: "789 Mountain View Dr, Springfield",
    phone: "(555) 987-6543",
    services: ["Installation", "Maintenance"],
    estimatedValue: "$28,000",
    estimatedDuration: "5 days",
    priority: "medium",
    approvedDate: "June 10, 2025",
    preferredStartDate: "July 1st",
    status: "scheduled",
    scheduledDate: "2025-07-01",
    assignedCrew: "Mike Rodriguez",
    outlookEventId: "outlook-event-123",
    blueSheetId: "BS-2025-002",
    estimateId: "EST-2025-002",
  },
  {
    id: "5",
    customerName: "Garcia Backyard Renovation",
    address: "789 Pine Rd, Springfield",
    phone: "(555) 456-7890",
    services: ["Installation", "Hardscape"],
    estimatedValue: "$42,000",
    estimatedDuration: "5 days",
    priority: "high",
    approvedDate: "June 8, 2025",
    status: "in-progress",
    scheduledDate: "2025-06-15",
    assignedCrew: "Tom Wilson",
    completionPercentage: 40,
    outlookEventId: "outlook-event-456",
    blueSheetId: "BS-2025-001",
    estimateId: "EST-2025-001",
  },
]

const crewMembers: CrewMember[] = [
  {
    id: "1",
    name: "Mike Rodriguez",
    initials: "MR",
    role: "Lead Installer",
    team: "Team 1",
    skills: ["Installation", "Hardscape", "Irrigation"],
    availability: "available",
    currentJobs: 1,
    maxJobs: 2,
  },
  {
    id: "2",
    name: "Tom Wilson",
    initials: "TW",
    role: "Installation Specialist",
    team: "Team 1",
    skills: ["Installation", "Tree Services", "Maintenance"],
    availability: "busy",
    currentJobs: 2,
    maxJobs: 2,
  },
  {
    id: "3",
    name: "Carlos Garcia",
    initials: "CG",
    role: "Hardscape Specialist",
    team: "Team 2",
    skills: ["Hardscape", "Installation", "Design"],
    availability: "available",
    currentJobs: 0,
    maxJobs: 2,
  },
  {
    id: "4",
    name: "James Chen",
    initials: "JC",
    role: "Maintenance Lead",
    team: "Team 2",
    skills: ["Maintenance", "Tree Services", "Installation"],
    availability: "available",
    currentJobs: 1,
    maxJobs: 3,
  },
]

export function JobScheduling({ initialFilter }: { initialFilter?: string | null }) {
  const searchParams = useSearchParams()
  const urlFilter = searchParams.get("filter")

  const [selectedProject, setSelectedProject] = useState<ApprovedProject | null>(null)
  const [outlookConnected, setOutlookConnected] = useState(true)
  const [lastSync, setLastSync] = useState("2 minutes ago")
  const [activeTab, setActiveTab] = useState("active")

  // Handle URL filter for approved jobs
  useEffect(() => {
    if (urlFilter === "approved" || initialFilter === "approved") {
      setActiveTab("approved")
    }
  }, [urlFilter, initialFilter])

  const handleScheduleProject = (project: ApprovedProject) => {
    // Navigate to calendar with project selected for scheduling
    window.location.href = `/calendar?schedule=${project.id}&project=${encodeURIComponent(project.customerName)}`
  }

  const handleOutlookSync = () => {
    setLastSync("Just now")
  }

  const handleConnectOutlook = () => {
    setOutlookConnected(true)
  }

  const getStatusCounts = () => {
    return {
      approved: allProjects.filter((p) => p.status === "approved").length,
      scheduled: allProjects.filter((p) => p.status === "scheduled").length,
      inProgress: allProjects.filter((p) => p.status === "in-progress").length,
      completed: allProjects.filter((p) => p.status === "completed").length,
      onHold: allProjects.filter((p) => p.status === "on-hold").length,
    }
  }

  const statusCounts = getStatusCounts()
  const approvedProjects = allProjects.filter((p) => p.status === "approved")

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Job Scheduling</h1>
            <p className="text-slate-600">Schedule approved projects and manage crew assignments</p>
          </div>
          <div className="flex items-center gap-3">
            {outlookConnected ? (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>Outlook connected</span>
                <span className="text-slate-400">•</span>
                <span>Synced {lastSync}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOutlookSync}
                  className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectOutlook}
                variant="outline"
                size="sm"
                className="h-10 px-4 border-slate-200 rounded-lg"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect Outlook
              </Button>
            )}
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
              size="sm"
              className="h-12 px-4 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-lg shadow-none"
            >
              <Plus className="mr-2 h-5 w-5" />
              Schedule New Job
            </Button>
          </div>
        </div>

        {/* Alert for approved jobs filter */}
        {(urlFilter === "approved" || initialFilter === "approved") && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Urgent: Jobs Need Scheduling</h3>
                <p className="text-sm text-red-800">
                  {approvedProjects.length} approved projects are waiting to be scheduled. Delays may impact customer
                  satisfaction and revenue.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Crew Availability Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none mb-6">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Crew Availability</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                {crewMembers.map((crew) => (
                  <CrewAvailabilityCard key={crew.id} crew={crew} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto grid grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger
                    value="approved"
                    className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Need Scheduling ({statusCounts.approved})
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Active Projects ({statusCounts.scheduled + statusCounts.inProgress})
                  </TabsTrigger>
                  <TabsTrigger
                    value="deliveries"
                    className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Deliveries
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Calendar
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full lg:w-[140px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 px-4 rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="approved" className="space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardHeader className="p-4 lg:p-6 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Approved Projects Awaiting Schedule ({approvedProjects.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                    {approvedProjects.map((project) => (
                      <ProjectSchedulingCard
                        key={project.id}
                        project={project}
                        onSchedule={() => handleScheduleProject(project)}
                      />
                    ))}
                    {approvedProjects.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">All Projects Scheduled</h3>
                        <p className="text-slate-500">Great job! All approved projects have been scheduled.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardHeader className="p-4 lg:p-6 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                    {/* Scheduled Projects */}
                    {allProjects.filter((project) => project.status === "scheduled").length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                          Scheduled ({allProjects.filter((project) => project.status === "scheduled").length})
                        </h3>
                        <div className="space-y-3">
                          {allProjects
                            .filter((project) => project.status === "scheduled")
                            .map((project) => (
                              <ScheduledProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                      </div>
                    )}

                    {/* In Progress Projects */}
                    {allProjects.filter((project) => project.status === "in-progress").length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                          In Progress ({allProjects.filter((project) => project.status === "in-progress").length})
                        </h3>
                        <div className="space-y-3">
                          {allProjects
                            .filter((project) => project.status === "in-progress")
                            .map((project) => (
                              <InProgressJobCard key={project.id} project={project} />
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deliveries" className="space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardHeader className="p-4 lg:p-6 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">Delivery Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Delivery Management</h3>
                      <p className="text-slate-500 mb-4">Schedule and track material deliveries for your projects.</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule Delivery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardHeader className="p-4 lg:p-6 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">Calendar View</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Calendar Integration</h3>
                      <p className="text-slate-500 mb-4">View all scheduled jobs and events in calendar format.</p>
                      <Button asChild>
                        <Link href="/calendar">
                          <Calendar className="mr-2 h-4 w-4" />
                          Open Full Calendar
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CrewAvailabilityCardProps {
  crew: CrewMember
}

function CrewAvailabilityCard({ crew }: CrewAvailabilityCardProps) {
  const workloadPercentage = (crew.currentJobs / crew.maxJobs) * 100

  return (
    <div className="p-3 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{crew.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-sm text-slate-900">{crew.name}</p>
          <p className="text-xs text-slate-500">{crew.role}</p>
        </div>
        {crew.availability === "available" && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
        {crew.availability === "busy" && <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>}
        {crew.availability === "unavailable" && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
      </div>

      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Workload</span>
          <span className="text-slate-900">
            {crew.currentJobs}/{crew.maxJobs}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              workloadPercentage >= 100 ? "bg-red-500" : workloadPercentage >= 75 ? "bg-yellow-500" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {crew.skills.slice(0, 2).map((skill) => (
          <Badge
            key={skill}
            className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs px-1.5 py-0.5 rounded font-medium border-0"
          >
            {skill}
          </Badge>
        ))}
        {crew.skills.length > 2 && (
          <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs px-1.5 py-0.5 rounded font-medium border-0">
            +{crew.skills.length - 2}
          </Badge>
        )}
      </div>
    </div>
  )
}

interface ProjectSchedulingCardProps {
  project: ApprovedProject
  onSchedule: () => void
}

function ProjectSchedulingCard({ project, onSchedule }: ProjectSchedulingCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50/30"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50/30"
      case "low":
        return "border-l-blue-500 bg-blue-50/30"
      default:
        return "border-l-slate-300"
    }
  }

  return (
    <div
      className={`p-4 border border-slate-200 rounded-lg border-l-4 ${getPriorityColor(project.priority)} hover:border-slate-300 transition-colors`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{project.customerName}</h3>
            {project.priority === "high" && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{project.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <Phone className="h-3 w-3" />
            <span>{project.phone}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-emerald-600">{project.estimatedValue}</div>
          <div className="text-xs text-slate-500">{project.estimatedDuration}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {project.services.map((service) => (
          <Badge
            key={service}
            className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
          >
            {service}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-slate-500">Approved:</span>
          <span className="ml-2 text-slate-900">{project.approvedDate}</span>
        </div>
        <div>
          <span className="text-slate-500">Preferred Start:</span>
          <span className="ml-2 text-slate-900">{project.preferredStartDate || "Flexible"}</span>
        </div>
      </div>

      {project.specialRequirements && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-xs font-medium text-blue-900 mb-1">Special Requirements:</div>
          <div className="text-xs text-blue-800">{project.specialRequirements}</div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href={`/blue-sheets/${project.blueSheetId}`}>Blue Sheet: {project.blueSheetId}</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href={`/estimates/${project.estimateId}`}>Estimate: {project.estimateId}</Link>
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
          View Details
        </Button>
        <Button
          onClick={onSchedule}
          size="sm"
          className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 rounded-lg"
        >
          Schedule Project
        </Button>
      </div>
    </div>
  )
}

interface ScheduledProjectCardProps {
  project: ApprovedProject
}

function ScheduledProjectCard({ project }: ScheduledProjectCardProps) {
  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-emerald-50/50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900">{project.customerName}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{project.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <span className="font-medium">Scheduled:</span>
            <span>{project.scheduledDate ? new Date(project.scheduledDate).toLocaleDateString() : "TBD"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <span className="font-medium">Crew:</span>
            <span>{project.assignedCrew}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs px-2 py-1 rounded-md font-medium border-0">
            <Calendar className="mr-1 h-3 w-3" />
            Scheduled
          </Badge>
          <span className="text-lg font-semibold text-emerald-600">{project.estimatedValue}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
        <ExternalLink className="h-4 w-4" />
        <span>Synced to Outlook Calendar</span>
      </div>

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
          View in Outlook
        </Button>
        <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
          Reschedule
        </Button>
        <Button size="sm" className="h-8 px-3 text-xs bg-blue-500 hover:bg-blue-600 rounded-lg">
          Start Job
        </Button>
      </div>
    </div>
  )
}

interface InProgressJobCardProps {
  project: ApprovedProject
}

function InProgressJobCard({ project }: InProgressJobCardProps) {
  return (
    <div className="p-4 border border-slate-200 rounded-lg bg-yellow-50/50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900">{project.customerName}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{project.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <span className="font-medium">Started:</span>
            <span>{project.scheduledDate ? new Date(project.scheduledDate).toLocaleDateString() : "Recently"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <span className="font-medium">Crew:</span>
            <span>{project.assignedCrew}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs px-2 py-1 rounded-md font-medium border-0">
            In Progress
          </Badge>
          <span className="text-lg font-semibold text-emerald-600">{project.estimatedValue}</span>
        </div>
      </div>

      {project.completionPercentage && (
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-slate-900">{project.completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-yellow-500 transition-all"
              style={{ width: `${project.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
          <Link href={`/jobs/${project.id}/green-sheet`}>View Green Sheet</Link>
        </Button>
        <Button size="sm" className="h-8 px-3 text-xs bg-blue-500 hover:bg-blue-600 rounded-lg">
          Update Progress
        </Button>
      </div>
    </div>
  )
}
