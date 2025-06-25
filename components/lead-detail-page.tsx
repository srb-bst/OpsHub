"use client"

import { useState } from "react"
import { ArrowLeft, User, Clock, Calendar, Tag, FileText, Edit3, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  address: string
  source: string
  services: string[]
  description: string
  timeAgo: string
  status: "new" | "assigned" | "contacted" | "consultation-needed"
  assignedTo?: string
  priority: "low" | "medium" | "high"
  budget?: string
  timeline?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface LeadDetailPageProps {
  lead: Lead
}

export function LeadDetailPage({ lead }: LeadDetailPageProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedLead, setEditedLead] = useState(lead)
  const [hasChanges, setHasChanges] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedLead(lead)
    setIsEditing(false)
    setHasChanges(false)
  }

  const handleSave = async () => {
    // Here you would save to database
    console.log("Saving lead:", editedLead)
    setIsEditing(false)
    setHasChanges(false)
    // In real app, you'd update the lead data
  }

  const handleChange = (field: string, value: string) => {
    setEditedLead((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleScheduleConsultation = () => {
    // Navigate to calendar with lead info pre-filled
    const consultationTitle = `${editedLead.name} - Consultation`
    const encodedTitle = encodeURIComponent(consultationTitle)
    const encodedCustomer = encodeURIComponent(editedLead.name)
    const encodedPhone = encodeURIComponent(editedLead.phone)
    const encodedAddress = encodeURIComponent(editedLead.address)
    const encodedServices = encodeURIComponent(editedLead.services.join(", "))

    router.push(
      `/calendar?schedule=consultation&title=${encodedTitle}&customer=${encodedCustomer}&phone=${encodedPhone}&address=${encodedAddress}&services=${encodedServices}&leadId=${editedLead.id}`,
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-50 text-green-700"
      case "assigned":
        return "bg-blue-50 text-blue-700"
      case "contacted":
        return "bg-yellow-50 text-yellow-700"
      case "consultation-needed":
        return "bg-emerald-50 text-emerald-700"
      default:
        return "bg-slate-50 text-slate-700"
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

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-4xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-10 w-10 p-0 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">{editedLead.name}</h1>
            <p className="text-slate-600">Lead Details</p>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel} className="h-10 px-4">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleEdit} className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    {isEditing ? (
                      <Input
                        value={editedLead.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-slate-900">{editedLead.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    {isEditing ? (
                      <Input
                        value={editedLead.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-slate-900">{editedLead.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    {isEditing ? (
                      <Input
                        value={editedLead.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-slate-900">{editedLead.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Source</label>
                    {isEditing ? (
                      <Select value={editedLead.source} onValueChange={(value) => handleChange("source", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Website Inquiry">Website Inquiry</SelectItem>
                          <SelectItem value="Nursery Walk-in">Nursery Walk-in</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Phone Inquiry">Phone Inquiry</SelectItem>
                          <SelectItem value="Online Ad">Online Ad</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 text-slate-900">{editedLead.source}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  {isEditing ? (
                    <Input
                      value={editedLead.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-slate-900">{editedLead.address}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Services Requested</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editedLead.services.map((service) => (
                      <Badge
                        key={service}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Budget</label>
                    {isEditing ? (
                      <Input
                        value={editedLead.budget || ""}
                        onChange={(e) => handleChange("budget", e.target.value)}
                        placeholder="e.g., $5,000 - $10,000"
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-slate-900">{editedLead.budget || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Timeline</label>
                    {isEditing ? (
                      <Input
                        value={editedLead.timeline || ""}
                        onChange={(e) => handleChange("timeline", e.target.value)}
                        placeholder="e.g., Spring 2024"
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-slate-900">{editedLead.timeline || "Not specified"}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={editedLead.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-slate-900">{editedLead.description}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Notes</label>
                  {isEditing ? (
                    <Textarea
                      value={editedLead.notes || ""}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      rows={3}
                      placeholder="Add internal notes..."
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-slate-900">{editedLead.notes || "No notes added"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Status & Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  {isEditing ? (
                    <Select value={editedLead.status} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="consultation-needed">Consultation Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={`mt-2 ${getStatusColor(editedLead.status)} text-xs px-2 py-1 rounded-md font-medium border-0`}
                    >
                      {editedLead.status === "consultation-needed"
                        ? "Consultation Needed"
                        : editedLead.status.charAt(0).toUpperCase() + editedLead.status.slice(1)}
                    </Badge>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  {isEditing ? (
                    <Select value={editedLead.priority} onValueChange={(value) => handleChange("priority", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${getPriorityColor(editedLead.priority)}`}></div>
                      <span className="text-sm text-slate-900 capitalize">{editedLead.priority}</span>
                    </div>
                  )}
                </div>
                {editedLead.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Assigned To</label>
                    <p className="mt-1 text-slate-900">{editedLead.assignedTo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions - Reordered */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleScheduleConsultation} variant="outline" className="w-full h-10 border-slate-200">
                  Schedule Consultation
                </Button>
                <Button className="w-full h-10 bg-emerald-500 hover:bg-emerald-600">Convert to Design Project</Button>

                {/* Future functionality - keeping for later implementation
                <Button variant="outline" className="w-full h-10 border-slate-200">
                  Send Follow-up Email
                </Button>
                <Button variant="outline" className="w-full h-10 border-slate-200">
                  Call Customer
                </Button>
                */}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-3 w-3" />
                    Created: {new Date(editedLead.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-3 w-3" />
                    Last Updated: {new Date(editedLead.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-3 w-3" />
                    {editedLead.timeAgo}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
