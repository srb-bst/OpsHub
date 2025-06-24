"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  User,
  DollarSign,
  FileText,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Camera,
  Map,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Job {
  id: string
  title: string
  customerName: string
  address: string
  coordinates: { lat: number; lng: number }
  phone: string
  email: string
  status: "scheduled" | "in-progress" | "completed" | "on-hold"
  priority: "low" | "medium" | "high"
  startDate: string
  estimatedCompletion: string
  actualCompletion?: string
  assignedCrew: string
  crewSize: number
  projectValue: string
  progress: number
  services: string[]
  lastUpdate: string
  issues: number
  blueSheetId: string
  estimateId: string
  currentDay: number
  totalDays: number
  onSchedule: boolean
  weatherStatus: string
  recentPhotos: number
  materialsStatus: "good" | "low" | "critical"
  qualityChecks: { passed: number; total: number }
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Garcia Backyard Renovation",
    customerName: "Maria Garcia",
    address: "1600 Pennsylvania Avenue NW, Washington, DC 20500",
    coordinates: { lat: 38.8977, lng: -77.0365 },
    phone: "(555) 456-7890",
    email: "maria.garcia@email.com",
    status: "in-progress",
    priority: "high",
    startDate: "June 15, 2025",
    estimatedCompletion: "June 22, 2025",
    assignedCrew: "Tom Wilson",
    crewSize: 3,
    projectValue: "$42,000",
    progress: 40,
    services: ["Hardscape", "Installation"],
    lastUpdate: "2 hours ago",
    issues: 1,
    blueSheetId: "BS-2025-001",
    estimateId: "EST-2025-001",
    currentDay: 3,
    totalDays: 7,
    onSchedule: true,
    weatherStatus: "Clear - Good for outdoor work",
    recentPhotos: 8,
    materialsStatus: "good",
    qualityChecks: { passed: 2, total: 3 },
  },
  {
    id: "2",
    title: "Parkside Community Center",
    customerName: "City of Springfield",
    address: "350 Fifth Avenue, New York, NY 10118",
    coordinates: { lat: 40.7484, lng: -73.9857 },
    phone: "(555) 567-8901",
    email: "parks@springfield.gov",
    status: "in-progress",
    priority: "medium",
    startDate: "June 14, 2025",
    estimatedCompletion: "June 25, 2025",
    assignedCrew: "Carlos Garcia",
    crewSize: 4,
    projectValue: "$22,000",
    progress: 60,
    services: ["Installation", "Maintenance"],
    lastUpdate: "4 hours ago",
    issues: 0,
    blueSheetId: "BS-2025-002",
    estimateId: "EST-2025-002",
    currentDay: 4,
    totalDays: 10,
    onSchedule: true,
    weatherStatus: "Partly cloudy - Good conditions",
    recentPhotos: 12,
    materialsStatus: "good",
    qualityChecks: { passed: 4, total: 4 },
  },
  {
    id: "3",
    title: "Hillcrest Estate Landscaping",
    customerName: "Robert & Jennifer Wilson",
    address: "1 Infinite Loop, Cupertino, CA 95014",
    coordinates: { lat: 37.3318, lng: -122.0312 },
    phone: "(555) 678-9012",
    email: "rwilson@email.com",
    status: "in-progress",
    priority: "high",
    startDate: "June 12, 2025",
    estimatedCompletion: "June 19, 2025",
    assignedCrew: "Mike Rodriguez",
    crewSize: 3,
    projectValue: "$35,500",
    progress: 50,
    services: ["Design", "Installation", "Tree Services"],
    lastUpdate: "1 day ago",
    issues: 2,
    blueSheetId: "BS-2025-003",
    estimateId: "EST-2025-003",
    currentDay: 6,
    totalDays: 7,
    onSchedule: false,
    weatherStatus: "Rain expected - Indoor prep only",
    recentPhotos: 15,
    materialsStatus: "low",
    qualityChecks: { passed: 3, total: 5 },
  },
  {
    id: "4",
    title: "Sunset Plaza Commercial",
    customerName: "Sunset Properties LLC",
    address: "1901 S Bell Ave, Chicago, IL 60608",
    coordinates: { lat: 41.8563, lng: -87.6548 },
    phone: "(555) 789-0123",
    email: "info@sunsetproperties.com",
    status: "on-hold",
    priority: "medium",
    startDate: "June 10, 2025",
    estimatedCompletion: "June 18, 2025",
    assignedCrew: "James Chen",
    crewSize: 2,
    projectValue: "$18,000",
    progress: 25,
    services: ["Maintenance", "Installation"],
    lastUpdate: "3 days ago",
    issues: 3,
    blueSheetId: "BS-2025-004",
    estimateId: "EST-2025-004",
    currentDay: 3,
    totalDays: 8,
    onSchedule: false,
    weatherStatus: "On hold - Permit issues",
    recentPhotos: 5,
    materialsStatus: "critical",
    qualityChecks: { passed: 1, total: 3 },
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("active")

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    const matchesPriority = priorityFilter === "all" || job.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getJobsByStatus = (status: string) => {
    if (status === "active") {
      return filteredJobs.filter((job) => job.status === "in-progress")
    }
    if (status === "scheduled") {
      return filteredJobs.filter((job) => job.status === "scheduled")
    }
    if (status === "on-hold") {
      return filteredJobs.filter((job) => job.status === "on-hold")
    }
    if (status === "completed") {
      return filteredJobs.filter((job) => job.status === "completed")
    }
    return filteredJobs
  }

  const activeJobs = getJobsByStatus("active")
  const scheduledJobs = getJobsByStatus("scheduled")
  const onHoldJobs = getJobsByStatus("on-hold")
  const completedJobs = getJobsByStatus("completed")

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Active Jobs</h1>
            <p className="text-slate-600">Manage ongoing projects and track progress with Green Sheets</p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none w-full lg:w-auto"
          >
            <Link href="/scheduling">
              <Plus className="mr-2 h-5 w-5" />
              Schedule New Job
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search jobs or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full lg:w-[180px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
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
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-4">
            <TabsTrigger
              value="active"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger
              value="scheduled"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Scheduled ({scheduledJobs.length})
            </TabsTrigger>
            <TabsTrigger
              value="on-hold"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              On Hold ({onHoldJobs.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              {activeJobs.length === 0 && (
                <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardContent className="p-8 text-center">
                    <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Active Jobs</h3>
                    <p className="text-slate-500 mb-4">All jobs are either scheduled or completed.</p>
                    <Button asChild>
                      <Link href="/scheduling">View Scheduled Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <div className="grid gap-4">
              {scheduledJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="on-hold" className="space-y-4">
            <div className="grid gap-4">
              {onHoldJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4">
              {completedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface JobCardProps {
  job: Job
}

function JobCard({ job }: JobCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50/50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50/50"
      case "low":
        return "border-l-blue-500 bg-blue-50/50"
      default:
        return "border-l-slate-300"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Wrench className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Calendar className="mr-1 h-3 w-3" />
            Scheduled
          </Badge>
        )
      case "on-hold":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Clock className="mr-1 h-3 w-3" />
            On Hold
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  const getMaterialsStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "low":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  const getMapUrl = (address: string, coordinates: { lat: number; lng: number }) => {
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO4H0Rl_3Qx&q=${encodedAddress}&center=${coordinates.lat},${coordinates.lng}&zoom=15`
  }

  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none border-l-4 ${getPriorityColor(job.priority)}`}
    >
      <CardHeader className="p-4 lg:p-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-semibold text-slate-900">{job.title}</CardTitle>
              {job.priority === "high" && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
              {job.issues > 0 && (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {job.issues} issue{job.issues > 1 ? "s" : ""}
                </Badge>
              )}
              {!job.onSchedule && job.status === "in-progress" && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  Behind Schedule
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {job.customerName}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.address.split(",")[0]}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {job.phone}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Map className="mr-1 h-3 w-3" />
                    View Map
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {job.title} - Location
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600">
                      <strong>Address:</strong> {job.address}
                    </div>
                    <div className="w-full h-96 rounded-lg overflow-hidden border">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=demo&q=${encodeURIComponent(job.address)}&zoom=15`}
                        title={`Map for ${job.title}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Get Directions
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Map className="mr-2 h-4 w-4" />
                          Open in Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex items-center gap-2">{getStatusBadge(job.status)}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-0">
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          {/* Progress & Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm font-bold text-emerald-600">{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="h-2" />
            {job.status === "in-progress" && (
              <div className="text-sm text-slate-600">
                Day {job.currentDay} of {job.totalDays} • {job.weatherStatus}
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Project Value:</span>
              <span className="font-semibold text-slate-900">{job.projectValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Crew Lead:</span>
              <span className="text-slate-900">{job.assignedCrew}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Team Size:</span>
              <span className="text-slate-900">{job.crewSize} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Est. Completion:</span>
              <span className="text-slate-900">{job.estimatedCompletion}</span>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Quality Checks:</span>
              <span className="text-slate-900">
                {job.qualityChecks.passed}/{job.qualityChecks.total} passed
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Materials:</span>
              <span className={`font-medium ${getMaterialsStatusColor(job.materialsStatus)}`}>
                {job.materialsStatus.charAt(0).toUpperCase() + job.materialsStatus.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Recent Photos:</span>
              <span className="text-slate-900">{job.recentPhotos} photos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Last Update:</span>
              <span className="text-slate-900">{job.lastUpdate}</span>
            </div>
          </div>
        </div>

        {/* Reference Links */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href={`/blue-sheets/${job.blueSheetId}`}>
              <FileText className="mr-1 h-3 w-3" />
              Blue Sheet: {job.blueSheetId}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href={`/estimates/${job.estimateId}`}>
              <DollarSign className="mr-1 h-3 w-3" />
              Estimate: {job.estimateId}
            </Link>
          </Button>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.services.map((service, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-2">
          {job.status === "in-progress" && (
            <>
              <Button asChild className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                <Link href={`/jobs/${job.id}/green-sheet`}>
                  <Wrench className="mr-2 h-4 w-4" />
                  Open Green Sheet
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/jobs/${job.id}/green-sheet?tab=photos`}>
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photos
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/jobs/${job.id}/green-sheet?tab=daily`}>
                  <Clock className="mr-2 h-4 w-4" />
                  Daily Update
                </Link>
              </Button>
            </>
          )}
          {job.status === "scheduled" && (
            <>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Calendar className="mr-2 h-4 w-4" />
                Start Job
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/scheduling?job=${job.id}`}>
                  <Clock className="mr-2 h-4 w-4" />
                  Reschedule
                </Link>
              </Button>
            </>
          )}
          {job.status === "on-hold" && (
            <>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                <Wrench className="mr-2 h-4 w-4" />
                Resume Job
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/jobs/${job.id}/green-sheet?tab=issues`}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  View Issues ({job.issues})
                </Link>
              </Button>
            </>
          )}
          {job.status === "completed" && (
            <>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/jobs/${job.id}/green-sheet`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Final Report
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/jobs/${job.id}/green-sheet?tab=photos`}>
                  <Camera className="mr-2 h-4 w-4" />
                  Final Photos
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
