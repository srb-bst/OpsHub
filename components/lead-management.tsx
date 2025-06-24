"use client"

import { useState } from "react"
import { Filter, Plus, Search, User, Phone, MapPin, Clock, ChevronRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LeadManagement() {
  const searchParams = useSearchParams()
  const urlFilter = searchParams.get("filter")
  const [selectedLead, setSelectedLead] = useState<string | null>(null)

  // Mock leads with realistic overdue data
  const mockLeads = [
    {
      id: "1",
      name: "Sarah Johnson",
      phone: "(555) 123-4567",
      address: "123 Oak Street, Springfield",
      source: "Website Inquiry",
      services: ["Design", "Installation"],
      description: "Looking for front yard redesign with low-maintenance plants",
      timeAgo: "3 days ago",
      status: "contacted",
      priority: "high",
      lastContact: "2024-01-15T10:00:00Z", // 3+ days ago - overdue
      assignedTo: "Emma Thompson",
    },
    {
      id: "2",
      name: "Mike Chen",
      phone: "(555) 234-5678",
      address: "456 Maple Drive, Springfield",
      source: "Nursery Walk-in",
      services: ["Delivery", "Installation"],
      description: "Purchased 15 shrubs, needs delivery and planting this week",
      timeAgo: "4 days ago",
      status: "contacted",
      priority: "medium",
      lastContact: "2024-01-14T14:30:00Z", // 4+ days ago - overdue
      assignedTo: "David Wilson",
    },
    {
      id: "3",
      name: "Jennifer Martinez",
      phone: "(555) 345-6789",
      address: "789 Pine Road, Springfield",
      source: "Referral",
      services: ["Design", "Hardscape"],
      description: "Complete backyard renovation including patio and landscaping",
      timeAgo: "1 day ago",
      status: "new",
      priority: "high",
    },
    {
      id: "4",
      name: "Robert Wilson",
      phone: "(555) 456-7890",
      address: "321 Cedar Lane, Springfield",
      source: "Phone Inquiry",
      services: ["Design", "Installation"],
      description: "Interested in drought-resistant landscaping for large property",
      timeAgo: "2 hours ago",
      status: "assigned",
      assignedTo: "Emma Thompson",
      priority: "medium",
      lastContact: "2024-01-18T16:00:00Z", // Recent
    },
  ]

  // Filter leads based on URL parameter
  const getFilteredLeads = () => {
    if (urlFilter === "overdue") {
      return mockLeads.filter((lead) => {
        if (!lead.lastContact) return false
        const lastContact = new Date(lead.lastContact)
        const now = new Date()
        const hoursDiff = (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60)
        return hoursDiff > 48 // More than 48 hours
      })
    }
    return mockLeads
  }

  const filteredLeads = getFilteredLeads()
  const isOverdueFilter = urlFilter === "overdue"

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
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
              className="pl-10 h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-full lg:w-[140px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
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
          <Tabs defaultValue="unassigned" className="w-full">
            <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6">
              <TabsTrigger
                value="unassigned"
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none flex-1 lg:flex-none"
              >
                Unassigned ({mockLeads.filter((l) => l.status === "new").length})
              </TabsTrigger>
              <TabsTrigger
                value="assigned"
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none flex-1 lg:flex-none"
              >
                Assigned ({mockLeads.filter((l) => l.status === "assigned" || l.status === "contacted").length})
              </TabsTrigger>
              <TabsTrigger
                value="qualified"
                className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none flex-1 lg:flex-none"
              >
                Qualified ({mockLeads.filter((l) => l.status === "qualified").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unassigned" className="space-y-4">
              <div className="grid gap-4">
                {mockLeads
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
                {mockLeads
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

            <TabsContent value="qualified" className="space-y-4">
              <div className="grid gap-4">
                {mockLeads
                  .filter((l) => l.status === "qualified")
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
  status: "new" | "assigned" | "contacted" | "qualified"
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
  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-emerald-500 border-emerald-200" : "hover:bg-white"
      } ${showOverdueWarning ? "border-l-4 border-l-orange-500" : ""}`}
      onClick={onSelect}
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
            <ChevronRight className="h-4 w-4 text-slate-400" />
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
            {status === "new" && (
              <>
                <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
                  <Link href="/leads/assign">Assign</Link>
                </Button>
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                  New
                </Badge>
              </>
            )}
            {status === "assigned" && assignedTo && (
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                Assigned to {assignedTo}
              </Badge>
            )}
            {status === "contacted" && (
              <>
                {showOverdueWarning && (
                  <Button size="sm" className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 rounded-lg">
                    Follow Up Now
                  </Button>
                )}
                <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                  Contacted
                </Badge>
              </>
            )}
            {status === "qualified" && (
              <div className="flex items-center gap-2">
                {estimatedValue && <span className="text-sm font-semibold text-emerald-600">{estimatedValue}</span>}
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                  Qualified
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
