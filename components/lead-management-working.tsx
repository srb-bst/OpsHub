"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Phone, Mail, MapPin, Plus, Search, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Lead {
  id: number
  customer_id?: string
  source?: string
  status: string
  priority: string
  services?: string[]
  description?: string
  assigned_to?: number
  last_contact?: string
  created_at: string
  updated_at?: string
}

interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
}

export function LeadManagementWorking() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Fix hydration by ensuring client-only rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchData()
    }
  }, [mounted])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Attempting to connect to Supabase...")

      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from("customers")
        .select("count", { count: "exact", head: true })

      if (testError) {
        console.error("❌ Supabase connection test failed:", testError)
        setError(`Connection failed: ${testError.message}`)
        return
      }

      console.log("✅ Supabase connection successful")

      // Fetch data
      const [leadsResponse, customersResponse] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("*"),
      ])

      if (leadsResponse.error) {
        console.error("❌ Leads fetch error:", leadsResponse.error)
        setError(`Leads error: ${leadsResponse.error.message}`)
        return
      }

      if (customersResponse.error) {
        console.error("❌ Customers fetch error:", customersResponse.error)
        setError(`Customers error: ${customersResponse.error.message}`)
        return
      }

      console.log("✅ Data fetched successfully:", {
        leads: leadsResponse.data?.length || 0,
        customers: customersResponse.data?.length || 0,
      })

      setLeads(leadsResponse.data || [])
      setCustomers(customersResponse.data || [])
    } catch (err) {
      console.error("❌ Unexpected error:", err)
      setError(`Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId)

      if (error) {
        console.error("❌ Status update error:", error)
        return
      }

      // Update local state
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead,
        ),
      )

      console.log("✅ Lead status updated successfully")
    } catch (err) {
      console.error("❌ Failed to update lead status:", err)
    }
  }

  // Helper function to get customer info for a lead
  const getCustomerForLead = (lead: Lead): Customer | undefined => {
    return customers.find((customer) => customer.id === lead.customer_id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "consultation-needed":
        return "bg-orange-100 text-orange-800"
      case "qualified":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const customer = getCustomerForLead(lead)
    const matchesFilter = activeFilter === "all" || lead.status === activeFilter
    const matchesSearch =
      searchTerm === "" ||
      customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <p className="text-gray-600">
            {loading
              ? "Loading..."
              : error
                ? `❌ Error: ${error}`
                : leads.length > 0
                  ? `✅ Real Data: Found ${leads.length} leads and ${customers.length} customers from Supabase`
                  : "ℹ️ No Data: No leads found in database"}
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {["all", "new", "contacted", "consultation-needed", "qualified", "closed"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="capitalize"
            >
              {filter === "consultation-needed" ? "Consultation Needed" : filter}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading leads...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p className="mb-4">Error loading leads: {error}</p>
          <Button onClick={fetchData} className="mt-4">
            Retry Connection
          </Button>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {leads.length === 0 ? "No leads found. Add your first lead!" : "No leads match your current filters."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map((lead) => {
            const customer = getCustomerForLead(lead)
            const customerName = customer ? `${customer.first_name} ${customer.last_name}` : `Lead #${lead.id}`

            return (
              <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{customerName}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(lead.priority)}>{lead.priority}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status === "consultation-needed" ? "Consultation Needed" : lead.status}
                    </Badge>
                    {lead.source && <span className="text-sm text-gray-500">via {lead.source}</span>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Customer Info */}
                  {customer && (
                    <div className="space-y-2">
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      {customer.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {customer.address}
                            {customer.city && `, ${customer.city}`}
                            {customer.state && `, ${customer.state}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Services */}
                  {lead.services && lead.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {lead.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {lead.description && <p className="text-sm text-gray-600 line-clamp-2">{lead.description}</p>}

                  {/* Status Update */}
                  <div className="pt-2 border-t">
                    <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="consultation-needed">Consultation Needed</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timestamps */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
