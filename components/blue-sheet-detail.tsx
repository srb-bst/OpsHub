"use client"

import { useState } from "react"
import { ArrowLeft, Camera, MapPin, Phone, Mail, User, Clock, DollarSign, Plus, FileText, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileUpload } from "@/components/file-upload"

interface BlueSheetDetailProps {
  blueSheetId: string
}

export function BlueSheetDetail({ blueSheetId }: BlueSheetDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [newNote, setNewNote] = useState("")

  // Mock data - would come from API
  const blueSheet = {
    id: blueSheetId,
    customerName: "Sarah Johnson",
    address: "123 Oak Street, Springfield, IL 62701",
    phone: "(555) 123-4567",
    email: "sarah.johnson@email.com",
    designer: "Emma Thompson",
    designerInitials: "ET",
    status: "in-progress",
    priority: "high",
    services: ["Design", "Installation"],
    projectType: "Residential",
    projectArea: "Front Yard",
    estimatedBudget: "$10,000 - $25,000",
    timeline: "Within 3 months",
    description: "Looking for front yard redesign with low-maintenance plants and modern aesthetic",
    completionPercentage: 65,
    createdDate: "June 15, 2025",
    lastUpdated: "2 hours ago",
    consultationDate: "Today, 2:00 PM",
    photos: [
      { id: 1, url: "/placeholder.svg?height=200&width=300", caption: "Current front yard view" },
      { id: 2, url: "/placeholder.svg?height=200&width=300", caption: "Existing plantings" },
      { id: 3, url: "/placeholder.svg?height=200&width=300", caption: "Driveway area" },
    ],
    notes: [
      {
        id: 1,
        date: "June 15, 2025",
        author: "Emma Thompson",
        content: "Initial consultation scheduled. Customer prefers drought-resistant plants.",
      },
      {
        id: 2,
        date: "June 16, 2025",
        author: "Emma Thompson",
        content: "Site visit completed. Soil test needed for pH levels. Customer interested in native plants.",
      },
      {
        id: 3,
        date: "June 17, 2025",
        author: "Emma Thompson",
        content: "Design concepts in progress. Customer wants to see 3 different options.",
      },
    ],
    measurements: {
      totalArea: "1,200 sq ft",
      plantingArea: "800 sq ft",
      hardscapeArea: "400 sq ft",
    },
    plantList: [
      { name: "Japanese Maple", quantity: 2, size: "6-8 ft", notes: "Feature trees" },
      { name: "Boxwood Hedge", quantity: 15, size: "18-24 in", notes: "Border planting" },
      { name: "Hostas", quantity: 20, size: "1 gal", notes: "Shade areas" },
    ],
    attachments: [
      {
        id: "1",
        name: "Site_Survey_Photos.pdf",
        type: "application/pdf",
        size: "5.2 MB",
        uploadedDate: "June 16, 2025",
        uploadedBy: "Emma Thompson",
        url: "/placeholder.pdf",
      },
    ],
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add note logic here
      console.log("Adding note:", newNote)
      setNewNote("")
    }
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/blue-sheets">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">{blueSheet.customerName}</h1>
            <p className="text-slate-600">{blueSheet.address}</p>
          </div>
          <div className="flex items-center gap-2">
            {blueSheet.priority === "high" && <div className="h-3 w-3 bg-red-500 rounded-full"></div>}
            <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-sm px-3 py-1 rounded-lg font-medium border-0">
              <Clock className="mr-1 h-4 w-4" />
              In Progress
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none mb-6">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">Project Completion</span>
              <span className="text-sm font-semibold text-slate-900">{blueSheet.completionPercentage}%</span>
            </div>
            <Progress value={blueSheet.completionPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Started {blueSheet.createdDate}</span>
              <span>Last updated {blueSheet.lastUpdated}</span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-2 lg:grid-cols-6">
            <TabsTrigger
              value="overview"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Photos ({blueSheet.photos.length})
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Notes ({blueSheet.notes.length})
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Design
            </TabsTrigger>
            <TabsTrigger
              value="estimate"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Estimate
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Customer Information */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{blueSheet.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{blueSheet.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{blueSheet.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{blueSheet.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <span className="ml-2 text-slate-900">{blueSheet.projectType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Area:</span>
                      <span className="ml-2 text-slate-900">{blueSheet.projectArea}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Budget:</span>
                      <span className="ml-2 text-slate-900">{blueSheet.estimatedBudget}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Timeline:</span>
                      <span className="ml-2 text-slate-900">{blueSheet.timeline}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blueSheet.services.map((service) => (
                      <Badge
                        key={service}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Description */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Project Description</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <p className="text-slate-700">{blueSheet.description}</p>
              </CardContent>
            </Card>

            {/* Designer & Status */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Assignment & Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-100">{blueSheet.designerInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{blueSheet.designer}</p>
                      <p className="text-sm text-slate-500">Lead Designer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Next Consultation</p>
                    <p className="font-medium text-slate-900">{blueSheet.consultationDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">Site Photos</CardTitle>
                  <Button size="sm" className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                    <Camera className="mr-2 h-4 w-4" />
                    Add Photos
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {blueSheet.photos.map((photo) => (
                    <div key={photo.id} className="space-y-2">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption}
                        className="w-full h-48 object-cover rounded-lg border border-slate-200"
                      />
                      <p className="text-sm text-slate-600">{photo.caption}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Project Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                {/* Add New Note */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <Label htmlFor="newNote" className="text-sm font-medium text-slate-700">
                    Add New Note
                  </Label>
                  <Textarea
                    id="newNote"
                    placeholder="Add your observations, decisions, or next steps..."
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    size="sm"
                    className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </div>

                {/* Existing Notes */}
                <div className="space-y-4">
                  {blueSheet.notes.map((note) => (
                    <div key={note.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{note.author}</span>
                        <span className="text-sm text-slate-500">{note.date}</span>
                      </div>
                      <p className="text-slate-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Measurements */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Site Measurements</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Area:</span>
                    <span className="font-medium text-slate-900">{blueSheet.measurements.totalArea}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Planting Area:</span>
                    <span className="font-medium text-slate-900">{blueSheet.measurements.plantingArea}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hardscape Area:</span>
                    <span className="font-medium text-slate-900">{blueSheet.measurements.hardscapeArea}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Plant List */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Proposed Plant List</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-3">
                    {blueSheet.plantList.map((plant, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{plant.name}</p>
                          <p className="text-sm text-slate-500">{plant.notes}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{plant.quantity}x</p>
                          <p className="text-sm text-slate-500">{plant.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="estimate" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">Project Estimate</CardTitle>
                  <Button size="sm" className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Generate Estimate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Ready for Estimate</h3>
                  <p className="text-slate-500 mb-6">
                    Complete the design documentation to generate a detailed project estimate.
                  </p>
                  <Button className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-lg">Create Estimate</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* File Upload */}
              <FileUpload
                label="Upload Project Documents"
                description="Upload PDFs, estimates, or other project-related documents"
                onFileUpload={(file) => {
                  console.log("File uploaded:", file.name)
                  // Handle file upload logic here
                }}
              />

              {/* Existing Documents */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Attached Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-4">
                    {blueSheet.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-red-600" />
                          <div>
                            <h4 className="font-medium text-slate-900">{attachment.name}</h4>
                            <p className="text-sm text-slate-500">
                              {attachment.size} • Uploaded {attachment.uploadedDate} by {attachment.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 mt-8">
          <Button
            variant="outline"
            className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
          >
            Schedule Consultation
          </Button>
          <Button className="flex-1 h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-lg">
            Update Status
          </Button>
          <Button className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg">
            Mark Ready for Estimate
          </Button>
        </div>
      </div>
    </div>
  )
}
