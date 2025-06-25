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
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  DollarSign,
  Palette,
  Leaf,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"

interface DesignProjectDetailProps {
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

export function DesignProjectDetail({ designId }: DesignProjectDetailProps) {
  const [design, setDesign] = useState<DesignProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    fetchDesignProject()
  }, [designId])

  const fetchDesignProject = async () => {
    try {
      const { data, error } = await supabase.from("design_projects").select("*").eq("id", designId).single()

      if (error) {
        console.error("Error fetching design project:", error)
        return
      }

      setDesign(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "needs-estimate":
        return "bg-orange-100 text-orange-700"
      case "pending-approval":
        return "bg-blue-100 text-blue-700"
      case "approved":
        return "bg-green-100 text-green-700"
      case "on-hold":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
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

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote)
      // TODO: Implement note saving
      setNewNote("")
    }
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
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/designs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">{design.title}</h1>
            </div>
            <p className="text-slate-600">
              {design.customer_name} • {design.project_type} • {design.area}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={`${getStatusColor(design.status)} text-sm px-3 py-1 rounded-full font-medium border-0 flex items-center gap-1`}
            >
              {getStatusIcon(design.status)}
              {getStatusLabel(design.status)}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-2 lg:grid-cols-4">
            <TabsTrigger
              value="overview"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="customer"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Design Details
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Project Summary */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Project Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <span className="ml-2 text-slate-900 capitalize">{design.project_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Area:</span>
                      <span className="ml-2 text-slate-900">{design.area}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Budget:</span>
                      <span className="ml-2 text-slate-900">{design.budget_range || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Timeline:</span>
                      <span className="ml-2 text-slate-900">{design.timeline || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Style:</span>
                      <span className="ml-2 text-slate-900">{design.design_style || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Maintenance:</span>
                      <span className="ml-2 text-slate-900">{design.maintenance_level || "Not specified"}</span>
                    </div>
                  </div>
                  {design.description && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Project Description</h4>
                      <p className="text-sm text-slate-600">{design.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
                  {design.status === "needs-estimate" && (
                    <Button
                      asChild
                      className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                    >
                      <Link href={`/estimates/new?design=${design.id}`}>
                        <DollarSign className="mr-2 h-5 w-5" />
                        Create Estimate
                      </Link>
                    </Button>
                  )}

                  {design.status === "pending-approval" && (
                    <Button
                      asChild
                      className="w-full h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-lg"
                    >
                      <Link href="/estimates">
                        <ClipboardList className="mr-2 h-5 w-5" />
                        Check Estimates
                      </Link>
                    </Button>
                  )}

                  {design.status === "approved" && (
                    <Button
                      asChild
                      className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                    >
                      <Link href="/scheduling">
                        <Calendar className="mr-2 h-5 w-5" />
                        Schedule Project
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
                  >
                    <Edit className="mr-2 h-5 w-5" />
                    Edit Project
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Project Timeline */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">SY</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-slate-900">Project Created</h4>
                        <div className="text-xs text-slate-500">
                          {new Date(design.created_at).toLocaleDateString()} at{" "}
                          {new Date(design.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">Design project initiated with customer requirements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-900">{design.customer_name || "Not provided"}</span>
                </div>
                {design.customer_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{design.customer_phone}</span>
                  </div>
                )}
                {design.customer_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{design.customer_email}</span>
                  </div>
                )}
                {design.customer_address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <div className="text-slate-900">
                      <div>{design.customer_address}</div>
                      {(design.customer_city || design.customer_state || design.customer_zip) && (
                        <div className="text-sm text-slate-600">
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
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Design Preferences */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Style Preference</h4>
                    <p className="text-sm text-slate-600">{design.design_style || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Maintenance Level</h4>
                    <p className="text-sm text-slate-600 capitalize">{design.maintenance_level || "Not specified"}</p>
                  </div>
                  {design.plant_preferences && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Plant Preferences</h4>
                      <p className="text-sm text-slate-600">{design.plant_preferences}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Plant Recommendations */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Plant Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  {design.recommended_plants ? (
                    <p className="text-sm text-slate-600">{design.recommended_plants}</p>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No plant recommendations yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Initial Design Notes */}
            {design.initial_design_notes && (
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Initial Design Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <p className="text-sm text-slate-600">{design.initial_design_notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Staff Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                {design.staff_notes ? (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">{design.staff_notes}</p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 italic">No staff notes yet</p>
                  </div>
                )}

                {/* Add Note Section */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <Label htmlFor="newNote" className="text-sm font-medium text-slate-700 mb-2 block">
                    Add Staff Note
                  </Label>
                  <Textarea
                    id="newNote"
                    placeholder="Add notes about customer communication, design changes, or project updates..."
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 mb-3"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    size="sm"
                    className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
