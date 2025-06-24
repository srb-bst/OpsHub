"use client"

import { useState } from "react"
import { Search, Plus, AlertTriangle, Clock, CheckCircle, X, Camera, MapPin, User, Calendar, Tag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NurseryIssue {
  id: string
  title: string
  description: string
  type: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  location: string
  assignedTo: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags: string[]
  photos: number
  comments: number
}

const mockIssues: NurseryIssue[] = [
  {
    id: "1",
    title: "Aphid infestation on Japanese Maples",
    description: "Large aphid colony found on multiple Japanese Maple trees in Block A",
    type: "Pest Control",
    priority: "High",
    status: "Open",
    location: "Block A - Row 3",
    assignedTo: "Mike Johnson",
    createdBy: "Sarah Wilson",
    createdAt: "2 hours ago",
    updatedAt: "1 hour ago",
    dueDate: "June 20, 2025",
    tags: ["aphids", "japanese-maple", "urgent"],
    photos: 3,
    comments: 2,
  },
  {
    id: "2",
    title: "Irrigation system leak",
    description: "Main irrigation line has developed a significant leak affecting Block B",
    type: "Equipment",
    priority: "Critical",
    status: "In Progress",
    location: "Block B - Main Line",
    assignedTo: "Sarah Wilson",
    createdBy: "Tom Davis",
    createdAt: "4 hours ago",
    updatedAt: "30 minutes ago",
    dueDate: "June 18, 2025",
    tags: ["irrigation", "leak", "critical"],
    photos: 2,
    comments: 5,
  },
  {
    id: "3",
    title: "Yellowing leaves on Hostas",
    description: "Multiple Hosta plants showing yellowing leaves, possible nutrient deficiency",
    type: "Plant Health",
    priority: "Medium",
    status: "Open",
    location: "Block C - Shade Area",
    assignedTo: "Tom Davis",
    createdBy: "Mike Johnson",
    createdAt: "6 hours ago",
    updatedAt: "6 hours ago",
    dueDate: "June 22, 2025",
    tags: ["hostas", "yellowing", "nutrients"],
    photos: 4,
    comments: 1,
  },
  {
    id: "4",
    title: "Fertilizer spreader malfunction",
    description: "Spreader not distributing fertilizer evenly, needs repair or replacement",
    type: "Equipment",
    priority: "Low",
    status: "Resolved",
    location: "Equipment Shed",
    assignedTo: "Mike Johnson",
    createdBy: "Sarah Wilson",
    createdAt: "1 day ago",
    updatedAt: "4 hours ago",
    tags: ["equipment", "fertilizer", "maintenance"],
    photos: 1,
    comments: 3,
  },
  {
    id: "5",
    title: "Powdery mildew on roses",
    description: "White powdery substance on rose leaves, spreading quickly",
    type: "Disease",
    priority: "High",
    status: "In Progress",
    location: "Block D - Rose Garden",
    assignedTo: "Tom Davis",
    createdBy: "Mike Johnson",
    createdAt: "1 day ago",
    updatedAt: "2 hours ago",
    dueDate: "June 19, 2025",
    tags: ["roses", "powdery-mildew", "disease"],
    photos: 6,
    comments: 4,
  },
]

export function NurseryIssueList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || issue.type === typeFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesAssignee = assigneeFilter === "all" || issue.assignedTo === assigneeFilter

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "open" && issue.status === "Open") ||
      (activeTab === "in-progress" && issue.status === "In Progress") ||
      (activeTab === "resolved" && issue.status === "Resolved") ||
      (activeTab === "closed" && issue.status === "Closed")

    return matchesSearch && matchesType && matchesPriority && matchesAssignee && matchesTab
  })

  const getIssuesByStatus = (status: string) => {
    if (status === "all") return filteredIssues
    if (status === "open") return filteredIssues.filter((issue) => issue.status === "Open")
    if (status === "in-progress") return filteredIssues.filter((issue) => issue.status === "In Progress")
    if (status === "resolved") return filteredIssues.filter((issue) => issue.status === "Resolved")
    if (status === "closed") return filteredIssues.filter((issue) => issue.status === "Closed")
    return filteredIssues
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      case "Closed":
        return <X className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Nursery Issues</h1>
          <p className="text-slate-600 mt-1">Track and manage all nursery issues and maintenance tasks</p>
        </div>
        <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
          <Link href="/nursery/issues/new">
            <Plus className="h-4 w-4 mr-2" />
            Report Issue
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search issues, descriptions, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Issue Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Pest Control">Pest Control</SelectItem>
                <SelectItem value="Disease">Disease</SelectItem>
                <SelectItem value="Plant Health">Plant Health</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Irrigation">Irrigation</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                <SelectItem value="Tom Davis">Tom Davis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="all">All ({mockIssues.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({mockIssues.filter((i) => i.status === "Open").length})</TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({mockIssues.filter((i) => i.status === "In Progress").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({mockIssues.filter((i) => i.status === "Resolved").length})
          </TabsTrigger>
          <TabsTrigger value="closed">Closed ({mockIssues.filter((i) => i.status === "Closed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {getIssuesByStatus(activeTab).map((issue) => (
              <Card key={issue.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <Link
                            href={`/nursery/issues/${issue.id}`}
                            className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                          >
                            {issue.title}
                          </Link>
                          <p className="text-slate-600 mt-1 line-clamp-2">{issue.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {issue.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {issue.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {issue.assignedTo}
                        </div>
                        <div className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {issue.photos} photos
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {issue.createdAt}
                        </div>
                        {issue.dueDate && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="h-3 w-3" />
                            Due: {issue.dueDate}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {issue.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(issue.priority)} variant="outline">
                          {issue.priority}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {getStatusIcon(issue.status)}
                          <span className="ml-1">{issue.status}</span>
                        </Badge>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/nursery/issues/${issue.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {getIssuesByStatus(activeTab).length === 0 && (
              <Card className="border-slate-200">
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Issues Found</h3>
                  <p className="text-slate-500 mb-4">
                    {activeTab === "all"
                      ? "No issues match your current filters."
                      : `No ${activeTab.replace("-", " ")} issues found.`}
                  </p>
                  <Button asChild>
                    <Link href="/nursery/issues/new">Report New Issue</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
