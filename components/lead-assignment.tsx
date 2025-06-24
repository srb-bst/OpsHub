"use client"

import { useState } from "react"
import { ArrowLeft, User, Clock, MapPin, Phone, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Designer {
  id: string
  name: string
  avatar?: string
  initials: string
  currentLeads: number
  maxLeads: number
  specialties: string[]
  availability: "available" | "busy" | "unavailable"
  nextAvailable?: string
}

interface Lead {
  id: string
  name: string
  phone: string
  address: string
  services: string[]
  priority: "low" | "medium" | "high"
  source: string
  description: string
  timeAgo: string
  estimatedValue?: string
}

const designers: Designer[] = [
  {
    id: "1",
    name: "Emma Thompson",
    initials: "ET",
    currentLeads: 3,
    maxLeads: 8,
    specialties: ["Residential", "Modern Design", "Xeriscaping"],
    availability: "available",
  },
  {
    id: "2",
    name: "David Kim",
    initials: "DK",
    currentLeads: 6,
    maxLeads: 8,
    specialties: ["Commercial", "Hardscape", "Large Projects"],
    availability: "busy",
    nextAvailable: "Tomorrow",
  },
  {
    id: "3",
    name: "Sarah Martinez",
    initials: "SM",
    currentLeads: 2,
    maxLeads: 6,
    specialties: ["Residential", "Traditional", "Maintenance"],
    availability: "available",
  },
  {
    id: "4",
    name: "Mike Johnson",
    initials: "MJ",
    currentLeads: 8,
    maxLeads: 8,
    specialties: ["Tree Services", "Irrigation", "Problem Solving"],
    availability: "unavailable",
    nextAvailable: "Next Week",
  },
]

const unassignedLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    address: "123 Oak Street, Springfield",
    services: ["Design", "Installation"],
    priority: "high",
    source: "Website Inquiry",
    description: "Looking for front yard redesign with low-maintenance plants",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    name: "Mike Chen",
    phone: "(555) 234-5678",
    address: "456 Maple Drive, Springfield",
    services: ["Delivery", "Installation"],
    priority: "medium",
    source: "Nursery Walk-in",
    description: "Purchased 15 shrubs, needs delivery and planting this week",
    timeAgo: "4 hours ago",
  },
  {
    id: "3",
    name: "Jennifer Martinez",
    phone: "(555) 345-6789",
    address: "789 Pine Road, Springfield",
    services: ["Design", "Hardscape"],
    priority: "high",
    source: "Referral",
    description: "Complete backyard renovation including patio and landscaping",
    timeAgo: "1 day ago",
    estimatedValue: "$35,000",
  },
]

export function LeadAssignment() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedDesigner, setSelectedDesigner] = useState<string>("")
  const [assignmentNotes, setAssignmentNotes] = useState("")
  const [bulkSelection, setBulkSelection] = useState<string[]>([])

  const handleBulkSelect = (leadId: string, checked: boolean) => {
    if (checked) {
      setBulkSelection([...bulkSelection, leadId])
    } else {
      setBulkSelection(bulkSelection.filter((id) => id !== leadId))
    }
  }

  const handleAssignLead = (lead: Lead) => {
    if (!selectedDesigner) return

    // Assignment logic would go here
    console.log("Assigning lead", lead.id, "to designer", selectedDesigner)

    // Reset form
    setSelectedLead(null)
    setSelectedDesigner("")
    setAssignmentNotes("")
  }

  const handleBulkAssign = () => {
    if (!selectedDesigner || bulkSelection.length === 0) return

    // Bulk assignment logic would go here
    console.log("Bulk assigning leads", bulkSelection, "to designer", selectedDesigner)

    // Reset form
    setBulkSelection([])
    setSelectedDesigner("")
    setAssignmentNotes("")
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/leads">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Lead Assignment</h1>
            <p className="text-slate-600">Assign leads to designers based on workload and expertise</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Designer Workload Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none mb-6">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Designer Workload</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                {designers.map((designer) => (
                  <DesignerCard
                    key={designer.id}
                    designer={designer}
                    isSelected={selectedDesigner === designer.id}
                    onSelect={() => setSelectedDesigner(designer.id)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Assignment Form */}
            {(selectedLead || bulkSelection.length > 0) && (
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {bulkSelection.length > 0 ? `Assign ${bulkSelection.length} Leads` : `Assign ${selectedLead?.name}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="designer" className="text-sm font-medium text-slate-700">
                      Select Designer
                    </Label>
                    <Select value={selectedDesigner} onValueChange={setSelectedDesigner}>
                      <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
                        <SelectValue placeholder="Choose designer" />
                      </SelectTrigger>
                      <SelectContent>
                        {designers
                          .filter((d) => d.availability !== "unavailable")
                          .map((designer) => (
                            <SelectItem key={designer.id} value={designer.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">{designer.initials}</AvatarFallback>
                                </Avatar>
                                <span>{designer.name}</span>
                                <Badge
                                  className={`ml-2 text-xs ${
                                    designer.availability === "available"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-yellow-50 text-yellow-700"
                                  }`}
                                >
                                  {designer.currentLeads}/{designer.maxLeads}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                      Assignment Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any specific instructions or notes for the designer..."
                      rows={3}
                      value={assignmentNotes}
                      onChange={(e) => setAssignmentNotes(e.target.value)}
                      className="text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedLead(null)
                        setBulkSelection([])
                        setSelectedDesigner("")
                        setAssignmentNotes("")
                      }}
                      className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        bulkSelection.length > 0
                          ? handleBulkAssign
                          : () => selectedLead && handleAssignLead(selectedLead)
                      }
                      disabled={!selectedDesigner}
                      className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                    >
                      Assign {bulkSelection.length > 0 ? `${bulkSelection.length} Leads` : "Lead"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Unassigned Leads */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="individual" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1">
                  <TabsTrigger
                    value="individual"
                    className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Individual Assignment
                  </TabsTrigger>
                  <TabsTrigger
                    value="bulk"
                    className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    Bulk Assignment
                  </TabsTrigger>
                </TabsList>

                {bulkSelection.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">{bulkSelection.length} selected</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkSelection([])}
                      className="h-8 px-3 text-xs rounded-lg border-slate-200"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="individual" className="space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardHeader className="p-4 lg:p-6 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Unassigned Leads ({unassignedLeads.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                    {unassignedLeads.map((lead) => (
                      <LeadAssignmentCard
                        key={lead.id}
                        lead={lead}
                        isSelected={selectedLead?.id === lead.id}
                        onSelect={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                        showCheckbox={false}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4">
                <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardHeader className="p-4 lg:p-6 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Select Leads for Bulk Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                    {unassignedLeads.map((lead) => (
                      <LeadAssignmentCard
                        key={lead.id}
                        lead={lead}
                        isSelected={bulkSelection.includes(lead.id)}
                        onSelect={() => handleBulkSelect(lead.id, !bulkSelection.includes(lead.id))}
                        showCheckbox={true}
                      />
                    ))}
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

interface DesignerCardProps {
  designer: Designer
  isSelected: boolean
  onSelect: () => void
}

function DesignerCard({ designer, isSelected, onSelect }: DesignerCardProps) {
  const workloadPercentage = (designer.currentLeads / designer.maxLeads) * 100

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      } ${designer.availability === "unavailable" ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={designer.availability !== "unavailable" ? onSelect : undefined}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={designer.avatar || "/placeholder.svg"} />
          <AvatarFallback>{designer.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{designer.name}</h3>
          <div className="flex items-center gap-2">
            {designer.availability === "available" && (
              <Badge className="bg-green-50 text-green-700 hover:bg-green-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Available
              </Badge>
            )}
            {designer.availability === "busy" && (
              <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                <Clock className="mr-1 h-3 w-3" />
                Busy
              </Badge>
            )}
            {designer.availability === "unavailable" && (
              <Badge className="bg-red-50 text-red-700 hover:bg-red-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                <AlertCircle className="mr-1 h-3 w-3" />
                Unavailable
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Current Workload</span>
          <span className="font-medium text-slate-900">
            {designer.currentLeads}/{designer.maxLeads}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              workloadPercentage >= 100 ? "bg-red-500" : workloadPercentage >= 75 ? "bg-yellow-500" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs text-slate-500 mb-1">Specialties</div>
        <div className="flex flex-wrap gap-1">
          {designer.specialties.slice(0, 2).map((specialty) => (
            <Badge
              key={specialty}
              className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0"
            >
              {specialty}
            </Badge>
          ))}
          {designer.specialties.length > 2 && (
            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0">
              +{designer.specialties.length - 2}
            </Badge>
          )}
        </div>
      </div>

      {designer.nextAvailable && (
        <div className="mt-2 text-xs text-slate-500">Next available: {designer.nextAvailable}</div>
      )}
    </div>
  )
}

interface LeadAssignmentCardProps {
  lead: Lead
  isSelected: boolean
  onSelect: () => void
  showCheckbox: boolean
}

function LeadAssignmentCard({ lead, isSelected, onSelect, showCheckbox }: LeadAssignmentCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {showCheckbox && (
          <div className="mt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lead.priority === "high" && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
              {lead.priority === "medium" && <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>}
              {lead.priority === "low" && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
              {lead.estimatedValue && (
                <span className="text-sm font-semibold text-emerald-600">{lead.estimatedValue}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{lead.address}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {lead.services.map((service) => (
              <Badge
                key={service}
                className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
              >
                {service}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{lead.description}</p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lead.timeAgo}
            </div>
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0">
              {lead.source}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
