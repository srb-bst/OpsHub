"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Truck,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface GreenSheetPageProps {
  params: {
    id: string
  }
}

export default function GreenSheetPage({ params }: GreenSheetPageProps) {
  return <GreenSheetDetail jobId={params.id} />
}

interface GreenSheetDetailProps {
  jobId: string
}

function GreenSheetDetail({ jobId }: GreenSheetDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newUpdate, setNewUpdate] = useState("")
  const [newIssue, setNewIssue] = useState("")

  // Mock data for active job
  const greenSheet = {
    id: jobId,
    jobTitle: "Garcia Backyard Renovation",
    customerName: "Maria Garcia",
    address: "789 Pine Road, Springfield, IL 62701",
    phone: "(555) 456-7890",
    email: "maria.garcia@email.com",
    projectValue: "$42,000",
    startDate: "June 15, 2025",
    estimatedCompletion: "June 22, 2025",
    actualProgress: 40,
    assignedCrew: "Tom Wilson",
    crewSize: "3 people",
    status: "in-progress",
    priority: "high",
    weatherStatus: "Clear - Good for outdoor work",

    // Daily Progress
    dailyUpdates: [
      {
        date: "June 17, 2025",
        crew: "Tom Wilson",
        hoursWorked: 8,
        progress: "Excavation 60% complete. Removed old patio stones.",
        issues: "None",
        materialsUsed: ["Gravel (2 yards)", "Sand (1 yard)"],
        nextDay: "Complete excavation, start base prep",
      },
      {
        date: "June 16, 2025",
        crew: "Tom Wilson",
        hoursWorked: 7,
        progress: "Started excavation for new patio area. Marked utilities.",
        issues: "Sprinkler line closer than expected - rerouted",
        materialsUsed: ["Marking paint", "Hand tools"],
        nextDay: "Continue excavation",
      },
    ],

    // Issues & Challenges
    activeIssues: [
      {
        id: 1,
        date: "June 16, 2025",
        severity: "medium",
        description: "Sprinkler line interference with patio excavation",
        resolution: "Rerouted line around patio area - customer approved",
        status: "resolved",
        reportedBy: "Tom Wilson",
      },
      {
        id: 2,
        date: "June 17, 2025",
        severity: "low",
        description: "Customer requested additional lighting fixture",
        resolution: "Pending - need electrical estimate",
        status: "pending",
        reportedBy: "Tom Wilson",
      },
    ],

    // Materials & Equipment
    materialsUsed: [
      { item: "Pavers (200 sq ft)", ordered: 200, used: 0, remaining: 200, unit: "sq ft" },
      { item: "Sand", ordered: 5, used: 1, remaining: 4, unit: "yards" },
      { item: "Gravel", ordered: 8, used: 2, remaining: 6, unit: "yards" },
      { item: "Landscape fabric", ordered: 250, used: 0, remaining: 250, unit: "sq ft" },
    ],

    equipmentOnSite: [
      { item: "Mini Excavator", status: "in-use", assignedTo: "Tom Wilson" },
      { item: "Compactor", status: "available", assignedTo: null },
      { item: "Wheelbarrow (2)", status: "in-use", assignedTo: "Crew" },
      { item: "Hand tools", status: "in-use", assignedTo: "Crew" },
    ],

    // Quality & Safety
    qualityChecks: [
      { item: "Excavation depth", status: "passed", checkedBy: "Tom Wilson", date: "June 16" },
      { item: "Grade/slope", status: "pending", checkedBy: null, date: null },
      { item: "Utility clearance", status: "passed", checkedBy: "Tom Wilson", date: "June 16" },
    ],

    safetyNotes: [
      "All crew wearing safety gear",
      "Utilities marked and cleared",
      "Customer pets secured during work hours",
      "Work area properly barricaded",
    ],

    // Photos
    progressPhotos: [
      { id: 1, date: "June 15", caption: "Site before work began", url: "/placeholder.svg?height=200&width=300" },
      { id: 2, date: "June 16", caption: "Excavation started", url: "/placeholder.svg?height=200&width=300" },
      { id: 3, date: "June 17", caption: "60% excavation complete", url: "/placeholder.svg?height=200&width=300" },
    ],

    // Customer Communication
    customerNotes: [
      {
        date: "June 17, 2025",
        type: "feedback",
        note: "Customer very happy with progress. Likes the precision of the excavation.",
        contactedBy: "Tom Wilson",
      },
      {
        date: "June 16, 2025",
        type: "change-request",
        note: "Customer asked about adding pathway lighting. Provided rough estimate.",
        contactedBy: "Tom Wilson",
      },
    ],
  }

  const handleAddUpdate = () => {
    if (newUpdate.trim()) {
      console.log("Adding daily update:", newUpdate)
      setNewUpdate("")
    }
  }

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      console.log("Adding issue:", newIssue)
      setNewIssue("")
    }
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/jobs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">{greenSheet.jobTitle}</h1>
            <p className="text-slate-600">
              {greenSheet.customerName} • {greenSheet.address}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {greenSheet.priority === "high" && <div className="h-3 w-3 bg-red-500 rounded-full"></div>}
            <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-sm px-3 py-1 rounded-lg font-medium border-0">
              <Wrench className="mr-1 h-4 w-4" />
              In Progress
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none mb-6">
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{greenSheet.actualProgress}%</div>
                <div className="text-sm text-slate-500">Complete</div>
                <Progress value={greenSheet.actualProgress} className="h-2 mt-2" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">{greenSheet.projectValue}</div>
                <div className="text-sm text-slate-500">Project Value</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Day 3 of 7</div>
                <div className="text-sm text-slate-500">Schedule</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-700">{greenSheet.weatherStatus}</div>
                <div className="text-sm text-slate-500">Weather Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-2 lg:grid-cols-6">
            <TabsTrigger
              value="overview"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="daily"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Daily Updates
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Issues ({greenSheet.activeIssues.filter((i) => i.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger
              value="materials"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Materials
            </TabsTrigger>
            <TabsTrigger
              value="quality"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Quality & Safety
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Photos ({greenSheet.progressPhotos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Job Information */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Job Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Start Date:</span>
                      <span className="ml-2 text-slate-900">{greenSheet.startDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Est. Completion:</span>
                      <span className="ml-2 text-slate-900">{greenSheet.estimatedCompletion}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Crew Lead:</span>
                      <span className="ml-2 text-slate-900">{greenSheet.assignedCrew}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Crew Size:</span>
                      <span className="ml-2 text-slate-900">{greenSheet.crewSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Contact */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Customer Contact</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{greenSheet.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{greenSheet.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{greenSheet.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{greenSheet.address}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Customer Communication */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Recent Customer Communication</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="space-y-4">
                  {greenSheet.customerNotes.map((note, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs px-2 py-1 rounded-md font-medium border-0 ${
                              note.type === "feedback" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {note.type === "feedback" ? "Feedback" : "Change Request"}
                          </Badge>
                          <span className="text-sm text-slate-500">{note.contactedBy}</span>
                        </div>
                        <span className="text-sm text-slate-500">{note.date}</span>
                      </div>
                      <p className="text-slate-700">{note.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Daily Progress Updates</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-6">
                {/* Add New Update */}
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-emerald-900 mb-3">Add Today's Update</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Hours Worked</Label>
                        <Input type="number" placeholder="8" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Progress %</Label>
                        <Input type="number" placeholder="45" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Work Completed Today</Label>
                      <Textarea
                        placeholder="Describe what was accomplished today..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Materials Used</Label>
                      <Input placeholder="Gravel (1 yard), Sand (0.5 yards)" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Plan for Tomorrow</Label>
                      <Input placeholder="Next steps..." className="mt-1" />
                    </div>
                    <Button onClick={handleAddUpdate} className="bg-emerald-500 hover:bg-emerald-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Update
                    </Button>
                  </div>
                </div>

                {/* Previous Updates */}
                <div className="space-y-4">
                  {greenSheet.dailyUpdates.map((update, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">{update.date}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{update.crew}</span>
                          <span>{update.hoursWorked} hours</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-slate-700">Progress: </span>
                          <span className="text-slate-900">{update.progress}</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Materials Used: </span>
                          <span className="text-slate-900">{update.materialsUsed.join(", ")}</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Next Day: </span>
                          <span className="text-slate-900">{update.nextDay}</span>
                        </div>
                        {update.issues !== "None" && (
                          <div>
                            <span className="font-medium text-red-700">Issues: </span>
                            <span className="text-red-900">{update.issues}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Issues & Challenges</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-6">
                {/* Add New Issue */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-3">Report New Issue</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Severity</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                          <SelectItem value="medium">Medium - Affects timeline</SelectItem>
                          <SelectItem value="high">High - Major problem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Issue Description</Label>
                      <Textarea
                        placeholder="Describe the issue in detail..."
                        value={newIssue}
                        onChange={(e) => setNewIssue(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddIssue} className="bg-red-500 hover:bg-red-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Report Issue
                    </Button>
                  </div>
                </div>

                {/* Existing Issues */}
                <div className="space-y-4">
                  {greenSheet.activeIssues.map((issue) => (
                    <div key={issue.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs px-2 py-1 rounded-md font-medium border-0 ${
                              issue.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : issue.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {issue.severity.toUpperCase()}
                          </Badge>
                          <Badge
                            className={`text-xs px-2 py-1 rounded-md font-medium border-0 ${
                              issue.status === "resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {issue.status === "resolved" ? (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            ) : (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {issue.status.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm text-slate-500">{issue.date}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-900">{issue.description}</p>
                        <div>
                          <span className="font-medium text-slate-700">Resolution: </span>
                          <span className="text-slate-900">{issue.resolution}</span>
                        </div>
                        <div className="text-sm text-slate-500">Reported by: {issue.reportedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Materials Tracking */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Materials Usage</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-4">
                    {greenSheet.materialsUsed.map((material, index) => (
                      <div key={index} className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-900">{material.item}</h4>
                          <Badge
                            className={`text-xs px-2 py-1 rounded-md font-medium border-0 ${
                              material.remaining / material.ordered > 0.5
                                ? "bg-green-100 text-green-700"
                                : material.remaining / material.ordered > 0.2
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {material.remaining} {material.unit} left
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                          <div>
                            Ordered: {material.ordered} {material.unit}
                          </div>
                          <div>
                            Used: {material.used} {material.unit}
                          </div>
                          <Progress value={(material.used / material.ordered) * 100} className="h-2 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Status */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Equipment On Site</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-4">
                    {greenSheet.equipmentOnSite.map((equipment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900">{equipment.item}</div>
                            {equipment.assignedTo && (
                              <div className="text-sm text-slate-500">Assigned to: {equipment.assignedTo}</div>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={`text-xs px-2 py-1 rounded-md font-medium border-0 ${
                            equipment.status === "in-use"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {equipment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quality Checks */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Quality Checkpoints</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-4">
                    {greenSheet.qualityChecks.map((check, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-slate-900">{check.item}</div>
                          {check.checkedBy && (
                            <div className="text-sm text-slate-500">
                              Checked by: {check.checkedBy} on {check.date}
                            </div>
                          )}
                        </div>
                        <Badge
                          className={`text-xs px-2 py-1 rounded-md font-medium border-0 ${
                            check.status === "passed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {check.status === "passed" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {check.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Safety Notes */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Safety Compliance</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-3">
                    {greenSheet.safetyNotes.map((note, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-green-800">{note}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">Progress Photos</CardTitle>
                  <Button size="sm" className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                    <Camera className="mr-2 h-4 w-4" />
                    Add Photos
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {greenSheet.progressPhotos.map((photo) => (
                    <div key={photo.id} className="space-y-2">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption}
                        className="w-full h-48 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="text-sm">
                        <div className="font-medium text-slate-900">{photo.caption}</div>
                        <div className="text-slate-500">{photo.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 mt-8">
          <Button
            variant="outline"
            className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
          >
            Print Green Sheet
          </Button>
          <Button className="flex-1 h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-lg">
            Update Progress
          </Button>
          <Button className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg">
            Mark Phase Complete
          </Button>
        </div>
      </div>
    </div>
  )
}
