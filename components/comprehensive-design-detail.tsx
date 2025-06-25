"use client"

import type React from "react"

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
  Leaf,
  FileText,
  Building,
  Target,
  Sun,
  Settings,
  Camera,
  Eye,
  Trash2,
  X,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

interface ComprehensiveDesignDetailProps {
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
  site_conditions?: string
  soil_type?: string
  sun_exposure?: string
  drainage?: string
  existing_plants?: string
  special_requirements?: string
  access_notes?: string
  utility_locations?: string
  created_at: string
  updated_at: string
}

interface ProjectNote {
  id: string
  content: string
  created_at: string
  author: string
  author_id: string
  note_type: "general" | "customer_contact" | "site_visit" | "design_update" | "estimate_note"
}

interface SitePhoto {
  id: string
  url: string
  caption?: string
  uploaded_at: string
  file_name: string
  file_size: number
}

// Mock current user - in real app, get from auth context
const CURRENT_USER = {
  id: "user-1",
  name: "Sarah Johnson",
  initials: "SJ",
}

export function ComprehensiveDesignDetail({ designId }: ComprehensiveDesignDetailProps) {
  const [design, setDesign] = useState<DesignProject | null>(null)
  const [notes, setNotes] = useState<ProjectNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState<ProjectNote["note_type"]>("general")
  const [isEditing, setIsEditing] = useState(false)
  const [editedDesign, setEditedDesign] = useState<Partial<DesignProject>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [sitePhotos, setSitePhotos] = useState<SitePhoto[]>([])
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  useEffect(() => {
    fetchDesignProject()
    fetchNotes()
  }, [designId])

  useEffect(() => {
    // Load mock site photos
    const mockPhotos: SitePhoto[] = [
      {
        id: "photo-1",
        url: "/placeholder.svg?height=300&width=300",
        caption: "Front yard - before work",
        uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        file_name: "front-yard-before.jpg",
        file_size: 2048000,
      },
      {
        id: "photo-2",
        url: "/placeholder.svg?height=300&width=300",
        caption: "Backyard soil conditions",
        uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        file_name: "backyard-soil.jpg",
        file_size: 1536000,
      },
      {
        id: "photo-3",
        url: "/placeholder.svg?height=300&width=300",
        caption: "Existing plants to remove",
        uploaded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        file_name: "existing-plants.jpg",
        file_size: 1792000,
      },
    ]
    setSitePhotos(mockPhotos)
  }, [])

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
    // Mock notes with different types and users
    const mockNotes: ProjectNote[] = [
      {
        id: "1",
        content:
          "Initial consultation completed. Customer prefers low-maintenance native plants and wants to focus on drought-resistant options.",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        author: "Sarah Johnson",
        author_id: "user-1",
        note_type: "customer_contact",
      },
      {
        id: "2",
        content: "Site visit scheduled for next Tuesday. Need to measure the back garden area and check soil drainage.",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        author: "Mike Chen",
        author_id: "user-2",
        note_type: "site_visit",
      },
      {
        id: "3",
        content:
          "Customer called to discuss budget concerns. Adjusted scope to focus on front yard only. Removing hardscape elements.",
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        author: "Sarah Johnson",
        author_id: "user-1",
        note_type: "customer_contact",
      },
      {
        id: "4",
        content:
          "Updated plant list to include more native species. Added California poppies and lavender per customer request.",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: "Lisa Park",
        author_id: "user-3",
        note_type: "design_update",
      },
    ]
    setNotes(mockNotes)
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    const note: ProjectNote = {
      id: Date.now().toString(),
      content: newNote.trim(),
      created_at: new Date().toISOString(),
      author: CURRENT_USER.name,
      author_id: CURRENT_USER.id,
      note_type: noteType,
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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingPhotos(true)
    try {
      const newPhotos: SitePhoto[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Create a mock URL for demo - in real app, upload to storage
        const mockUrl = URL.createObjectURL(file)

        const photo: SitePhoto = {
          id: `photo-${Date.now()}-${i}`,
          url: mockUrl,
          caption: "",
          uploaded_at: new Date().toISOString(),
          file_name: file.name,
          file_size: file.size,
        }

        newPhotos.push(photo)
      }

      setSitePhotos((prev) => [...newPhotos, ...prev])

      // TODO: Upload to actual storage service
      console.log("Photos uploaded:", newPhotos)
    } catch (error) {
      console.error("Error uploading photos:", error)
    } finally {
      setUploadingPhotos(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    setSitePhotos((prev) => prev.filter((photo) => photo.id !== photoId))

    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null)
    }

    // TODO: Delete from actual storage service
    console.log("Photo deleted:", photoId)
  }

  const handleUpdatePhotoCaption = async (photoId: string, caption: string) => {
    setSitePhotos((prev) => prev.map((photo) => (photo.id === photoId ? { ...photo, caption } : photo)))

    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto((prev) => (prev ? { ...prev, caption } : null))
    }

    // TODO: Update in database
    console.log("Photo caption updated:", photoId, caption)
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

  const getNoteTypeColor = (type: ProjectNote["note_type"]) => {
    switch (type) {
      case "customer_contact":
        return "bg-blue-100 text-blue-700"
      case "site_visit":
        return "bg-green-100 text-green-700"
      case "design_update":
        return "bg-purple-100 text-purple-700"
      case "estimate_note":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getNoteTypeLabel = (type: ProjectNote["note_type"]) => {
    switch (type) {
      case "customer_contact":
        return "Customer Contact"
      case "site_visit":
        return "Site Visit"
      case "design_update":
        return "Design Update"
      case "estimate_note":
        return "Estimate Note"
      default:
        return "General"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

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

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
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

                    <Button
                      variant="outline"
                      className="h-12 text-base font-medium rounded-xl border-slate-200 hover:bg-slate-50"
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-sm p-1 w-full grid grid-cols-5">
                  <TabsTrigger
                    value="overview"
                    className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="customer"
                    className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    Customer
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    Design
                  </TabsTrigger>
                  <TabsTrigger
                    value="site"
                    className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    Site Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="technical"
                    className="px-3 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    Technical
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Project Summary */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900">Project Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
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
                                  <SelectItem value="residential">Residential</SelectItem>
                                  <SelectItem value="commercial">Commercial</SelectItem>
                                  <SelectItem value="municipal">Municipal</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <p className="text-slate-900 capitalize bg-slate-50 p-3 rounded-xl">
                                {design.project_type}
                              </p>
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

                        {(design.description || isEditing) && (
                          <div>
                            <Label className="text-sm font-medium text-slate-700 mb-2 block">Description</Label>
                            {isEditing ? (
                              <Textarea
                                value={editedDesign.description || design.description || ""}
                                onChange={(e) => setEditedDesign((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="bg-white/80 border-slate-200 rounded-xl"
                              />
                            ) : (
                              <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">
                                {design.description || "No description provided"}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Status Timeline */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900">Project Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-slate-600">
                              Created: {new Date(design.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-slate-600">
                              Last Updated: {new Date(design.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-2 w-2 rounded-full ${design.status === "approved" ? "bg-green-500" : "bg-orange-500"}`}
                            ></div>
                            <span className="text-sm text-slate-600">Status: {getStatusLabel(design.status)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="customer" className="mt-6">
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 lg:grid-cols-2">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Customer Name</Label>
                          {isEditing ? (
                            <Input
                              value={editedDesign.customer_name || design.customer_name || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, customer_name: e.target.value }))}
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                              <User className="h-5 w-5 text-slate-400" />
                              <span className="text-slate-900">{design.customer_name || "Not provided"}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Phone</Label>
                          {isEditing ? (
                            <Input
                              value={editedDesign.customer_phone || design.customer_phone || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, customer_phone: e.target.value }))}
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                              <Phone className="h-5 w-5 text-slate-400" />
                              <span className="text-slate-900">{design.customer_phone || "Not provided"}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Email</Label>
                          {isEditing ? (
                            <Input
                              type="email"
                              value={editedDesign.customer_email || design.customer_email || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, customer_email: e.target.value }))}
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                              <Mail className="h-5 w-5 text-slate-400" />
                              <span className="text-slate-900">{design.customer_email || "Not provided"}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Address</Label>
                          {isEditing ? (
                            <Input
                              value={editedDesign.customer_address || design.customer_address || ""}
                              onChange={(e) =>
                                setEditedDesign((prev) => ({ ...prev, customer_address: e.target.value }))
                              }
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                              <MapPin className="h-5 w-5 text-slate-400" />
                              <span className="text-slate-900">{design.customer_address || "Not provided"}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">City</Label>
                          {isEditing ? (
                            <Input
                              value={editedDesign.customer_city || design.customer_city || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, customer_city: e.target.value }))}
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.customer_city || "Not provided"}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">State</Label>
                          {isEditing ? (
                            <Input
                              value={editedDesign.customer_state || design.customer_state || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, customer_state: e.target.value }))}
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.customer_state || "Not provided"}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">ZIP Code</Label>
                          {isEditing ? (
                            <Input
                              value={editedDesign.customer_zip || design.customer_zip || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, customer_zip: e.target.value }))}
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.customer_zip || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="design" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Design Preferences */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          Design Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                              onValueChange={(value) =>
                                setEditedDesign((prev) => ({ ...prev, maintenance_level: value }))
                              }
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
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Plant Preferences</Label>
                          {isEditing ? (
                            <Textarea
                              value={editedDesign.plant_preferences || design.plant_preferences || ""}
                              onChange={(e) =>
                                setEditedDesign((prev) => ({ ...prev, plant_preferences: e.target.value }))
                              }
                              rows={3}
                              placeholder="Customer's plant preferences..."
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">
                              {design.plant_preferences || "Not specified"}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Plant Recommendations */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Leaf className="h-5 w-5" />
                          Plant Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <Textarea
                            value={editedDesign.recommended_plants || design.recommended_plants || ""}
                            onChange={(e) =>
                              setEditedDesign((prev) => ({ ...prev, recommended_plants: e.target.value }))
                            }
                            rows={6}
                            placeholder="List recommended plants and materials..."
                            className="bg-white/80 border-slate-200 rounded-xl"
                          />
                        ) : (
                          <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">
                            {design.recommended_plants || "No plant recommendations yet"}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Initial Design Notes */}
                  <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-slate-900">Initial Design Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={editedDesign.initial_design_notes || design.initial_design_notes || ""}
                          onChange={(e) =>
                            setEditedDesign((prev) => ({ ...prev, initial_design_notes: e.target.value }))
                          }
                          rows={4}
                          placeholder="Initial design concepts and ideas..."
                          className="bg-white/80 border-slate-200 rounded-xl"
                        />
                      ) : (
                        <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">
                          {design.initial_design_notes || "No initial design notes"}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="site" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Site Conditions */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          Site Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Sun Exposure</Label>
                          {isEditing ? (
                            <Select
                              value={editedDesign.sun_exposure || design.sun_exposure || ""}
                              onValueChange={(value) => setEditedDesign((prev) => ({ ...prev, sun_exposure: value }))}
                            >
                              <SelectTrigger className="bg-white/80 border-slate-200 rounded-xl">
                                <SelectValue placeholder="Select sun exposure" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-sun">Full Sun (6+ hours)</SelectItem>
                                <SelectItem value="partial-sun">Partial Sun (4-6 hours)</SelectItem>
                                <SelectItem value="partial-shade">Partial Shade (2-4 hours)</SelectItem>
                                <SelectItem value="full-shade">Full Shade (&lt; 2 hours)</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.sun_exposure || "Not assessed"}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Soil Type</Label>
                          {isEditing ? (
                            <Input
                              value={editedDesign.soil_type || design.soil_type || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, soil_type: e.target.value }))}
                              placeholder="e.g., Clay, Sandy, Loam"
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.soil_type || "Not assessed"}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Drainage</Label>
                          {isEditing ? (
                            <Select
                              value={editedDesign.drainage || design.drainage || ""}
                              onValueChange={(value) => setEditedDesign((prev) => ({ ...prev, drainage: value }))}
                            >
                              <SelectTrigger className="bg-white/80 border-slate-200 rounded-xl">
                                <SelectValue placeholder="Select drainage" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.drainage || "Not assessed"}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Existing Conditions */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Existing Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Existing Plants</Label>
                          {isEditing ? (
                            <Textarea
                              value={editedDesign.existing_plants || design.existing_plants || ""}
                              onChange={(e) =>
                                setEditedDesign((prev) => ({ ...prev, existing_plants: e.target.value }))
                              }
                              rows={3}
                              placeholder="List existing plants to keep or remove..."
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">
                              {design.existing_plants || "No existing plants noted"}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Site Conditions</Label>
                          {isEditing ? (
                            <Textarea
                              value={editedDesign.site_conditions || design.site_conditions || ""}
                              onChange={(e) =>
                                setEditedDesign((prev) => ({ ...prev, site_conditions: e.target.value }))
                              }
                              rows={3}
                              placeholder="General site conditions and observations..."
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">
                              {design.site_conditions || "No site conditions noted"}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Site Photos */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm lg:col-span-2">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Camera className="h-5 w-5" />
                          Site Photos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Photo Upload */}
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-300 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-3">
                            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Camera className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">Upload Site Photos</p>
                              <p className="text-xs text-slate-500">Click to select multiple photos</p>
                            </div>
                          </label>
                        </div>

                        {/* Photo Gallery */}
                        {sitePhotos.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-900">Site Photos ({sitePhotos.length})</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPhotoModal(true)}
                                className="rounded-xl border-slate-200"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View All
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              {sitePhotos.slice(0, 8).map((photo, index) => (
                                <div key={photo.id} className="relative group">
                                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
                                    <img
                                      src={photo.url || "/placeholder.svg"}
                                      alt={photo.caption || `Site photo ${index + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                  </div>
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                                        onClick={() => {
                                          setSelectedPhoto(photo)
                                          setShowPhotoModal(true)
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                                        onClick={() => handleDeletePhoto(photo.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  {photo.caption && (
                                    <p className="text-xs text-slate-600 mt-2 truncate">{photo.caption}</p>
                                  )}
                                </div>
                              ))}
                            </div>

                            {sitePhotos.length > 8 && (
                              <div className="text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowPhotoModal(true)}
                                  className="rounded-xl border-slate-200"
                                >
                                  View {sitePhotos.length - 8} more photos
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {sitePhotos.length === 0 && (
                          <div className="text-center py-8">
                            <Camera className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500 mb-1">No site photos yet</p>
                            <p className="text-xs text-slate-400">Upload photos to document site conditions</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Special Requirements */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Special Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <Textarea
                            value={editedDesign.special_requirements || design.special_requirements || ""}
                            onChange={(e) =>
                              setEditedDesign((prev) => ({ ...prev, special_requirements: e.target.value }))
                            }
                            rows={4}
                            placeholder="Any special requirements or considerations..."
                            className="bg-white/80 border-slate-200 rounded-xl"
                          />
                        ) : (
                          <p className="text-slate-900 bg-slate-50 p-4 rounded-xl">
                            {design.special_requirements || "No special requirements"}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Access & Utilities */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Access & Utilities
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Access Notes</Label>
                          {isEditing ? (
                            <Textarea
                              value={editedDesign.access_notes || design.access_notes || ""}
                              onChange={(e) => setEditedDesign((prev) => ({ ...prev, access_notes: e.target.value }))}
                              rows={2}
                              placeholder="Access considerations for equipment, materials..."
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.access_notes || "No access notes"}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Utility Locations</Label>
                          {isEditing ? (
                            <Textarea
                              value={editedDesign.utility_locations || design.utility_locations || ""}
                              onChange={(e) =>
                                setEditedDesign((prev) => ({ ...prev, utility_locations: e.target.value }))
                              }
                              rows={2}
                              placeholder="Location of utilities, sprinklers, etc..."
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                          ) : (
                            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl">
                              {design.utility_locations || "No utility information"}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Project Notes */}
            <div className="space-y-6">
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
                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2 block">Note Type</Label>
                      <Select value={noteType} onValueChange={(value: ProjectNote["note_type"]) => setNoteType(value)}>
                        <SelectTrigger className="bg-white border-slate-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Note</SelectItem>
                          <SelectItem value="customer_contact">Customer Contact</SelectItem>
                          <SelectItem value="site_visit">Site Visit</SelectItem>
                          <SelectItem value="design_update">Design Update</SelectItem>
                          <SelectItem value="estimate_note">Estimate Note</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      <div key={note.id} className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                {getUserInitials(note.author)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-900">{note.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${getNoteTypeColor(note.note_type)} text-xs px-2 py-1 rounded-md font-medium border-0`}
                            >
                              {getNoteTypeLabel(note.note_type)}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              {formatDate(note.created_at)}
                            </div>
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

          {/* Photo Modal */}
          {showPhotoModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Site Photos</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowPhotoModal(false)
                      setSelectedPhoto(null)
                    }}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  {selectedPhoto ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={selectedPhoto.url || "/placeholder.svg"}
                          alt={selectedPhoto.caption || "Site photo"}
                          className="w-full max-h-96 object-contain rounded-xl bg-slate-50"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">Caption</Label>
                          <Input
                            value={selectedPhoto.caption || ""}
                            onChange={(e) => handleUpdatePhotoCaption(selectedPhoto.id, e.target.value)}
                            placeholder="Add a caption for this photo..."
                            className="bg-white border-slate-200 rounded-xl"
                          />
                        </div>
                        <div className="text-xs text-slate-500">
                          Uploaded: {new Date(selectedPhoto.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setSelectedPhoto(null)} className="rounded-xl">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Gallery
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeletePhoto(selectedPhoto.id)}
                          className="rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Photo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {sitePhotos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="relative group cursor-pointer"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
                            <img
                              src={photo.url || "/placeholder.svg"}
                              alt={photo.caption || `Site photo ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          {photo.caption && <p className="text-xs text-slate-600 mt-2 truncate">{photo.caption}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
