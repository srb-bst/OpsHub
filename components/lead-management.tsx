"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Filter, Plus, Search, User, Phone, MapPin, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function LeadManagement() {
  const searchParams = useSearchParams()
  const urlFilter = searchParams.get("filter")
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [leads, setLeads] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase.from("customers").select("*")

      if (leadsError) {
        console.error("Leads error:", leadsError)
        setError("Error loading leads: " + leadsError.message)
        return
      }

      if (customersError) {
        console.error("Customers error:", customersError)
        setError("Error loading customers: " + customersError.message)
        return
      }

      // Transform leads data to match expected format
      const transformedLeads =
        leadsData?.map((lead) => {
          const customer = customersData?.find((c) => c.id === lead.customer_id)
          return {
            id: lead.id.toString(),
            name: customer ? `${customer.first_name} ${customer.last_name}` : "Unknown Customer",
            phone: customer?.phone || "No phone",
            address: customer?.address || "No address",
            source: lead.source || "Unknown",
            services: lead.services || [],
            description: lead.description || "No description",
            timeAgo: getTimeAgo(lead.created_at),
            status: lead.status || "new",
            priority: lead.priority || "medium",
            lastContact: lead.last_contact,
            assignedTo: lead.assigned_to ? "Assigned" : undefined,
          }
        }) || []

      setLeads(transformedLeads)
      setCustomers(customersData || [])
      console.log("✅ Real Data Loaded:", { leads: transformedLeads.length, customers: customersData?.length })
    } catch (error) {
      console.error("Connection error:", error)
      setError("Connection error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  // Filter leads based on status and search
  const getFilteredLeads = (leads) => {
    let filtered = leads

    // Apply URL filter first (for overdue)
    if (urlFilter === "overdue") {
      filtered = leads.filter((lead) => {
        if (!lead.lastContact) return false
        const lastContact = new Date(lead.lastContact)
        const now = new Date()
        const hoursDiff = (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60)
        return hoursDiff > 48 // More than 48 hours
      })
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm) ||
          lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
        <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading leads...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
        <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Database Error:</strong> {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const filteredLeads = getFilteredLeads(leads)
  const isOverdueFilter = urlFilter === "overdue"

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        {/* Success banner */}
        <Alert className="mb-6 border-emerald-200 bg-emerald-50">
          <AlertCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            <strong>✅ Real Data Connected:</strong> Showing {leads.length} leads from Supabase database
          </AlertDescription>
        </Alert>

        {/* Alert banner for filtered views */}
        {isOverdueFilter && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Attention Required:</strong> Showing {filteredLeads.length} leads that need follow-up (no contact
              in 48+ hours)
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">
              {isOverdueFilter ? "Overdue Follow-ups" : "Lead Management"}
            </h1>
            <p className="text-slate-600">
              {isOverdueFilter ? "Leads requiring immediate follow-up" : "Capture and manage customer leads"}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none w-full lg:w-auto"
          >
            <Link href="/leads/new">
              <Plus className="mr-2 h-5 w-5" />
              New Lead
            </Link>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[140px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="consultation-needed">Consultation Needed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-12 px-4 rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Show filtered results directly if coming from dashboard */}
        {isOverdueFilter ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Leads Requiring Follow-up ({filteredLeads.length})
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/leads">View All Leads</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  {...lead}
                  isSelected={selectedLead === lead.id}
                  onSelect={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                  showOverdueWarning={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6">
              <TabsTrigger
                value="all"
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none flex-1 lg:flex-none"
              >
                All ({getFilteredLeads(leads).length})
              </TabsTrigger>
              <TabsTrigger
                value="unassigned"
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none flex-1 lg:flex-none"
              >
                Unassigned ({getFilteredLeads(leads.filter((l) => l.status === "new")).length})
              </TabsTrigger>
              <TabsTrigger
                value="assigned"
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none flex-1 lg:flex-none"
              >
                Assigned (
                {getFilteredLeads(leads.filter((l) => l.status === "assigned" || l.status === "contacted")).length})
              </TabsTrigger>
              <TabsTrigger
                value="consultation"
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none flex-1 lg:flex-none"
              >
                Consultation Needed ({getFilteredLeads(leads.filter((l) => l.status === "consultation-needed")).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    {...lead}
                    isSelected={selectedLead === lead.id}
                    onSelect={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="unassigned" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredLeads(leads)
                  .filter((l) => l.status === "new")
                  .map((lead) => (
                    <LeadCard
                      key={lead.id}
                      {...lead}
                      isSelected={selectedLead === lead.id}
                      onSelect={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="assigned" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredLeads(leads)
                  .filter((l) => l.status === "assigned" || l.status === "contacted")
                  .map((lead) => (
                    <LeadCard
                      key={lead.id}
                      {...lead}
                      isSelected={selectedLead === lead.id}
                      onSelect={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="consultation" className="space-y-4">
              <div className="grid gap-4">
                {getFilteredLeads(leads)
                  .filter((l) => l.status === "consultation-needed")
                  .map((lead) => (
                    <LeadCard
                      key={lead.id}
                      {...lead}
                      isSelected={selectedLead === lead.id}
                      onSelect={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {selectedLead && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setSelectedLead(null)}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <LeadDetails leadId={selectedLead} onClose={() => setSelectedLead(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface LeadCardProps {
  id: string
  name: string
  phone: string
  address: string
  source: string
  services: string[]
  description: string
  timeAgo: string
  status: "new" | "assigned" | "contacted" | "consultation-needed"
  assignedTo?: string
  priority: "low" | "medium" | "high"
  estimatedValue?: string
  isSelected: boolean
  onSelect: () => void
  showOverdueWarning?: boolean
}

function LeadCard({
  id,
  name,
  phone,
  address,
  source,
  services,
  description,
  timeAgo,
  status,
  assignedTo,
  priority,
  estimatedValue,
  isSelected,
  onSelect,
  showOverdueWarning = false,
}: LeadCardProps) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [hasChanges, setHasChanges] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as any)
    setHasChanges(true)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: currentStatus, updated_at: new Date().toISOString() })
        .eq("id", Number.parseInt(id))

      if (error) {
        console.error("Error updating lead:", error)
        alert("Error saving changes")
        return
      }

      console.log(`✅ Lead ${id} status updated to ${currentStatus}`)
      setHasChanges(false)
    } catch (error) {
      console.error("Error saving lead:", error)
      alert("Error saving changes")
    }
  }

  const handleCardClick = () => {
    window.location.href = `/leads/${id}`
  }

  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none cursor-pointer transition-all hover:bg-white ${
        showOverdueWarning ? "border-l-4 border-l-orange-500" : ""
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4 lg:p-6">
        {showOverdueWarning && (
          <div className="flex items-center gap-2 mb-3 text-orange-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Overdue for follow-up</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="h-3 w-3" />
                {phone}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {priority === "high" && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
            {priority === "medium" && <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>}
            {priority === "low" && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32 h-8 text-xs" onClick={(e) => e.stopPropagation()}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="consultation-needed">Consultation Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{address}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {services.map((service) => (
            <Badge
              key={service}
              className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
            >
              {service}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </div>
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0">
              {source}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                onClick={handleSave}
              >
                Save
              </Button>
            )}
            {currentStatus === "new" && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs rounded-lg border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href="/leads/assign">Assign</Link>
              </Button>
            )}
            {currentStatus === "assigned" && assignedTo && (
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                Assigned to {assignedTo}
              </Badge>
            )}
            {currentStatus === "contacted" && (
              <>
                {showOverdueWarning && (
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Follow Up Now
                  </Button>
                )}
                <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                  Contacted
                </Badge>
              </>
            )}
            {currentStatus === "consultation-needed" && (
              <div className="flex items-center gap-2">
                {estimatedValue && <span className="text-sm font-semibold text-emerald-600">{estimatedValue}</span>}
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                  Consultation Needed
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface LeadDetailsProps {
  leadId: string
  onClose: () => void
}

function LeadDetails({ leadId, onClose }: LeadDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Lead Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          ×
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button size="sm" className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-lg">
            Assign to Designer
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-12 border-slate-200 rounded-lg">
            Call Customer
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Quick Notes</label>
            <textarea
              className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm"
              rows={3}
              placeholder="Add notes about this lead..."
            />
          </div>

          <Button size="sm" variant="outline" className="w-full h-10 border-slate-200 rounded-lg">
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  )
}
