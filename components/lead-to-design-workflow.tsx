"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, User, Phone, Mail, MapPin, Palette } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface Lead {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  source: string
  services: string[]
  description: string
  priority: string
}

interface LeadToDesignWorkflowProps {
  lead: Lead
  onComplete: () => void
  onCancel: () => void
}

export function LeadToDesignWorkflow({ lead, onComplete, onCancel }: LeadToDesignWorkflowProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Pre-populate from lead
    customer_name: lead.name,
    customer_phone: lead.phone || "",
    customer_email: lead.email || "",
    customer_address: lead.address || "",

    // Design project specific fields
    title: `${lead.name} - Design Project`,
    project_type: "residential",
    area: "",
    description: lead.description,
    budget_range: "",
    timeline: "",
    design_style: "",
    maintenance_level: "medium",
    plant_preferences: "",
    services: lead.services,
    priority: lead.priority,
    consultation_date: "",
    designer_name: "",
    initial_design_notes: "",
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateDesignProject = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("design_projects")
        .insert([
          {
            ...formData,
            status: "draft",
            project_phase: "design",
            completion_percentage: 0,
            photos_count: 0,
            notes_count: 0,
            follow_up_required: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating design project:", error)
        return
      }

      // Update lead status to converted
      await supabase.from("leads").update({ status: "converted" }).eq("id", lead.id)

      onComplete()
      router.push(`/designs/${data.id}`)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Convert Lead to Design Project</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              ×
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}
            >
              {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : "1"}
            </div>
            <div className={`h-1 w-12 ${step >= 2 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}
            >
              {step > 2 ? <CheckCircle2 className="h-4 w-4" /> : "2"}
            </div>
            <div className={`h-1 w-12 ${step >= 3 ? "bg-emerald-500" : "bg-slate-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}
            >
              {step > 3 ? <CheckCircle2 className="h-4 w-4" /> : "3"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Step 1: Review Lead Information</h3>

              <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="font-medium">{lead.name}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <span>{lead.phone}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    <span>{lead.address}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {lead.services.map((service, index) => (
                    <Badge key={index} className="bg-blue-50 text-blue-700 border-0">
                      {service}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-3">{lead.description}</p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={() => setStep(2)} className="bg-emerald-500 hover:bg-emerald-600">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Step 2: Project Details</h3>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project_type">Project Type</Label>
                    <Select
                      value={formData.project_type}
                      onValueChange={(value) => handleInputChange("project_type", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="municipal">Municipal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="area">Project Area</Label>
                    <Input
                      id="area"
                      placeholder="e.g., Front yard, Backyard, Full property"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget_range">Budget Range</Label>
                    <Select
                      value={formData.budget_range}
                      onValueChange={(value) => handleInputChange("budget_range", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5k">Under $5,000</SelectItem>
                        <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                        <SelectItem value="15k-30k">$15,000 - $30,000</SelectItem>
                        <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
                        <SelectItem value="over-50k">Over $50,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-emerald-500 hover:bg-emerald-600">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Step 3: Design Preferences & Assignment</h3>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="design_style">Design Style</Label>
                    <Select
                      value={formData.design_style}
                      onValueChange={(value) => handleInputChange("design_style", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="cottage">Cottage</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="native">Native/Natural</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maintenance_level">Maintenance Level</Label>
                    <Select
                      value={formData.maintenance_level}
                      onValueChange={(value) => handleInputChange("maintenance_level", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Maintenance</SelectItem>
                        <SelectItem value="medium">Medium Maintenance</SelectItem>
                        <SelectItem value="high">High Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="plant_preferences">Plant Preferences</Label>
                  <Textarea
                    id="plant_preferences"
                    placeholder="Any specific plants, colors, or preferences..."
                    rows={2}
                    value={formData.plant_preferences}
                    onChange={(e) => handleInputChange("plant_preferences", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="designer_name">Assign Designer</Label>
                    <Select
                      value={formData.designer_name}
                      onValueChange={(value) => handleInputChange("designer_name", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select designer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emma Thompson">Emma Thompson</SelectItem>
                        <SelectItem value="David Wilson">David Wilson</SelectItem>
                        <SelectItem value="Alex Parker">Alex Parker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="consultation_date">Consultation Date</Label>
                    <Input
                      id="consultation_date"
                      type="date"
                      value={formData.consultation_date}
                      onChange={(e) => handleInputChange("consultation_date", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="initial_design_notes">Initial Design Notes</Label>
                  <Textarea
                    id="initial_design_notes"
                    placeholder="Any initial thoughts, requirements, or notes for the designer..."
                    rows={3}
                    value={formData.initial_design_notes}
                    onChange={(e) => handleInputChange("initial_design_notes", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleCreateDesignProject}
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  {loading ? "Creating..." : "Create Design Project"}
                  <Palette className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
