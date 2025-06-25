"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  DollarSign,
  Palette,
  MessageSquare,
  Send,
  Clock,
  Plus,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

interface EditableDesignDetailProps {
  designId: string
}

interface DesignProject {
  id: string
  customer_id: string
  title: string
  status: string
  project_type: string
  area: string
  description?: string
  budget_range?: string
  timeline?: string
  design_style?: string
  maintenance_level?: string
  plant_preferences?: string
  staff_notes?: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  customer_address?: string
  customer_city?: string
  customer_state?: string
  customer_zip?: string
  initial_design_notes?: string
  recommended_plants?: string
  created_at: string
  updated_at: string
}

interface Note {
  id: string
  content: string
  created_at: string
  author: string
}

export function EditableDesignDetail({ designId }: EditableDesignDetailProps) {
  const [design, setDesign] = useState<DesignProject | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedDesign, setEditedDesign] = useState<Partial<DesignProject>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDesignProject()
    fetchNotes()
  }, [designId])

  const fetchDesignProject = async () => {
    try {
      const { data, error } = await supabase.from("design_projects").select("*").eq("id", designId).single()

      if (error) {
        console.error("Error fetching design project:", error)
        return
      }

      setDesign(data)
      setEditedDesign(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotes = async () => {
    // Mock notes for now - in real app, fetch from database
    const mockNotes: Note[] = [
      {
        id: "1",
        content: "Initial consultation completed. Customer prefers low-maintenance native plants.",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: "Sarah Johnson",
      },
      {
        id: "2",
        content: "Site visit scheduled for next Tuesday. Need to measure the back garden area.",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: "Mike Chen",
      },
      {
        id: "3",
        content: "Customer called to discuss budget concerns. Adjusted scope to focus on front yard only.",
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        author: "Sarah Johnson",
      },
    ]
    setNotes(mockNotes)
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      created_at: new Date().toISOString(),
      author: "Current User", // In real app, get from auth
    }

    setNotes((prev) => [note, ...prev])
    setNewNote("")

    // TODO: Save to database
    console.log("Adding note:", note)
  }

  const handleSave = async () => {
    if (!design) return

    setSaving(true)
    try {
      const { error } = await supabase.from("design_projects").update(editedDesign).eq("id", designId)

      if (error) {
        console.error("Error updating design:", error)
        return
      }

      setDesign({ ...design, ...editedDesign })
      setIsEditing(false)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "needs-estimate":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "pending-approval":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "on-hold":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "needs-estimate":
        return "Needs Estimate"
      case "pending-approval":
        return "Pending Approval"
      case "approved":
        return "Approved"
      case "on-hold":
        return "On Hold"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "needs-estimate":
        return <CircleDashed className="h-4 w-4" />
      case "pending-approval":
        return <ClipboardList className="h-4 w-4" />
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <CircleDashed className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const [loading, setLoading] = useState(true)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading design project...</p>
        </div>
      </div>
    )
  }

  if (!design) {
    return (
      <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen">
        <div className="max-w-4xl mx-auto pt-16 lg:pt-0">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Design Project Not Found</h1>
            <p className="text-slate-600 mb-4">The design project you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/designs">Back to Designs</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-white/80 shadow-sm">
              <Link href="/designs">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <Input
                    value={editedDesign.title || design.title}
                    onChange={(e) => setEditedDesign((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-2xl lg:text-3xl font-semibold bg-white/80 border-slate-200 h-12"
                  />
                ) : (
                  <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">{design.title}</h1>
                )}
              </div>
              <p className="text-slate-600">
                {design.customer_name} • {design.project_type} • {design.area}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${getStatusColor(design.status)} text-sm px-4 py-2 rounded-full font-medium border flex items-center gap-2`}
              >
                {getStatusIcon(design.status)}
                {getStatusLabel(design.status)}
              </Badge>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setEditedDesign(design)
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-200 hover:bg-white/80"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {design.status === "needs-estimate" && (
                      <Button
                        asChild
                        className="h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                      >
                        <Link href={`/estimates/new?design=${design.id}`}>
                          <DollarSign className="mr-2 h-5 w-5" />
                          Create Estimate
                        </Link>
                      </Button>
                    )}

                    {design.status === "pending-approval" && (
                      <Button asChild className="h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-xl">
                        <Link href="/estimates">
                          <ClipboardList className="mr-2 h-5 w-5" />
                          Check Estimates
                        </Link>
                      </Button>
                    )}

                    {design.status === "approved" && (
                      <Button
                        asChild
                        className="h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                      >
                        <Link href="/scheduling">
                          <Calendar className="mr-2 h-5 w-5" />
                          Schedule Project
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="h-12 text-base font-medium rounded-xl border-slate-200 hover:bg-slate-50"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Contact Customer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Project Type</Label>
                      {isEditing ? (
                        <Select
                          value={editedDesign.project_type || design.project_type}
                          onValueChange={(value) => setEditedDesign((prev) => ({ ...prev, project_type: value }))}
                        >
                          <SelectTrigger className="bg-white/80 border-slate-200 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="landscape-design">Landscape Design</SelectItem>
                            <SelectItem value="garden-renovation">Garden Renovation</SelectItem>
                            <SelectItem value="maintenance-plan">Maintenance Plan</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-slate-900 capitalize bg-slate-50 p-3 rounded-xl">{design.project_type}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Area</Label>
                      {isEditing ? (
                        <Input
                          value={editedDesign.area || design.area}
                          onChange={(e) => setEditedDesign((prev) => ({ ...prev, area: e.target.value }))}
                          className="bg-white/80 border-slate-200 rounded-xl"
                        />
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">{design.area}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Budget Range</Label>
                      {isEditing ? (
                        <Input
                          value={editedDesign.budget_range || design.budget_range || ""}
                          onChange={(e) => setEditedDesign((prev) => ({ ...prev, budget_range: e.target.value }))}
                          placeholder="e.g., $5,000 - $10,000"
                          className="bg-white/80 border-slate-200 rounded-xl"
                        />
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                          {design.budget_range || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Timeline</Label>
                      {isEditing ? (
                        <Input
                          value={editedDesign.timeline || design.timeline || ""}
                          onChange={(e) => setEditedDesign((prev) => ({ ...prev, timeline: e.target.value }))}
                          placeholder="e.g., 2-3 weeks"
                          className="bg-white/80 border-slate-200 rounded-xl"
                        />
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                          {design.timeline || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  {design.description && (
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Description</Label>
                      {isEditing ? (
                        <Textarea
                          value={editedDesign.description || design.description}
                          onChange={(e) => setEditedDesign((prev) => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="bg-white/80 border-slate-200 rounded-xl"
                        />
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">{design.description}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Design Preferences */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Style Preference</Label>
                      {isEditing ? (
                        <Input
                          value={editedDesign.design_style || design.design_style || ""}
                          onChange={(e) => setEditedDesign((prev) => ({ ...prev, design_style: e.target.value }))}
                          placeholder="e.g., Modern, Traditional, Native"
                          className="bg-white/80 border-slate-200 rounded-xl"
                        />
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                          {design.design_style || "Not specified"}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Maintenance Level</Label>
                      {isEditing ? (
                        <Select
                          value={editedDesign.maintenance_level || design.maintenance_level || ""}
                          onValueChange={(value) => setEditedDesign((prev) => ({ ...prev, maintenance_level: value }))}
                        >
                          <SelectTrigger className="bg-white/80 border-slate-200 rounded-xl">
                            <SelectValue placeholder="Select maintenance level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Maintenance</SelectItem>
                            <SelectItem value="medium">Medium Maintenance</SelectItem>
                            <SelectItem value="high">High Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-xl capitalize">
                          {design.maintenance_level || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  {(design.plant_preferences || isEditing) && (
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Plant Preferences</Label>
                      {isEditing ? (
                        <Textarea
                          value={editedDesign.plant_preferences || design.plant_preferences || ""}
                          onChange={(e) => setEditedDesign((prev) => ({ ...prev, plant_preferences: e.target.value }))}
                          rows={2}
                          placeholder="Customer's plant preferences..."
                          className="bg-white/80 border-slate-200 rounded-xl"
                        />
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">{design.plant_preferences}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {design.customer_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{design.customer_name || "Not provided"}</p>
                      <p className="text-sm text-slate-500">Customer</p>
                    </div>
                  </div>

                  {design.customer_phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-900">{design.customer_phone}</span>
                    </div>
                  )}

                  {design.customer_email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-900">{design.customer_email}</span>
                    </div>
                  )}

                  {design.customer_address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div className="text-slate-900">
                        <div>{design.customer_address}</div>
                        {(design.customer_city || design.customer_state || design.customer_zip) && (
                          <div className="text-slate-600">
                            {design.customer_city && design.customer_city}
                            {design.customer_city && design.customer_state && ", "}
                            {design.customer_state && design.customer_state}
                            {design.customer_zip && ` ${design.customer_zip}`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Notes */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Project Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Note */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add a note about this project..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                      className="bg-white border-slate-200 rounded-xl resize-none"
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      size="sm"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>

                  {/* Notes Feed */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">{note.author}</span>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {formatDate(note.created_at)}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700">{note.content}</p>
                      </div>
                    ))}

                    {notes.length === 0 && (
                      <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No notes yet</p>
                        <p className="text-xs text-slate-400">Add the first note above</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
