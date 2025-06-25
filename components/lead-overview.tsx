"use client"

import { useState, useEffect } from "react"
import { Users, TrendingUp, Clock, AlertCircle, User, Phone, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeadsByAssignee {
  assignee: string
  initials: string
  total_leads: number
  new_leads: number
  contacted_leads: number
  qualified_leads: number
  conversion_rate: number
  avg_response_time: number
  overdue_count: number
  leads: LeadSummary[]
}

interface LeadSummary {
  id: string
  customer_name: string
  phone?: string
  status: string
  priority: string
  source: string
  assigned_date: string
  last_contact?: string
  estimated_value?: string
  overdue: boolean
}

export function LeadOverview() {
  const [leadsByAssignee, setLeadsByAssignee] = useState<LeadsByAssignee[]>([])
  const [loading, setLoading] = useState(true)
  const [totalStats, setTotalStats] = useState({
    total_leads: 0,
    total_assignees: 0,
    avg_conversion: 0,
    overdue_leads: 0,
  })

  useEffect(() => {
    fetchLeadOverview()
  }, [])

  const fetchLeadOverview = async () => {
    try {
      // For now, we'll use mock data since we don't have a leads table with assignees
      // In a real implementation, this would fetch from your leads table
      const mockLeadData: LeadsByAssignee[] = [
        {
          assignee: "Emma Thompson",
          initials: "ET",
          total_leads: 12,
          new_leads: 3,
          contacted_leads: 6,
          qualified_leads: 3,
          conversion_rate: 25,
          avg_response_time: 2.5,
          overdue_count: 2,
          leads: [
            {
              id: "1",
              customer_name: "Sarah Johnson",
              phone: "(555) 123-4567",
              status: "contacted",
              priority: "high",
              source: "Website",
              assigned_date: "2024-01-15",
              last_contact: "2024-01-15",
              estimated_value: "$5,000",
              overdue: true,
            },
            {
              id: "2",
              customer_name: "Mike Chen",
              phone: "(555) 234-5678",
              status: "contacted",
              priority: "medium",
              source: "Referral",
              assigned_date: "2024-01-14",
              last_contact: "2024-01-14",
              estimated_value: "$3,500",
              overdue: true,
            },
            {
              id: "3",
              customer_name: "Lisa Rodriguez",
              phone: "(555) 345-6789",
              status: "qualified",
              priority: "high",
              source: "Walk-in",
              assigned_date: "2024-01-16",
              last_contact: "2024-01-17",
              estimated_value: "$8,000",
              overdue: false,
            },
          ],
        },
        {
          assignee: "David Wilson",
          initials: "DW",
          total_leads: 8,
          new_leads: 2,
          contacted_leads: 4,
          qualified_leads: 2,
          conversion_rate: 30,
          avg_response_time: 1.8,
          overdue_count: 1,
          leads: [
            {
              id: "4",
              customer_name: "Robert Martinez",
              phone: "(555) 456-7890",
              status: "new",
              priority: "medium",
              source: "Phone",
              assigned_date: "2024-01-17",
              overdue: false,
            },
            {
              id: "5",
              customer_name: "Jennifer Lee",
              phone: "(555) 567-8901",
              status: "contacted",
              priority: "low",
              source: "Website",
              assigned_date: "2024-01-13",
              last_contact: "2024-01-13",
              estimated_value: "$2,500",
              overdue: true,
            },
          ],
        },
        {
          assignee: "Alex Parker",
          initials: "AP",
          total_leads: 15,
          new_leads: 4,
          contacted_leads: 8,
          qualified_leads: 3,
          conversion_rate: 20,
          avg_response_time: 3.2,
          overdue_count: 3,
          leads: [
            {
              id: "6",
              customer_name: "Tom Anderson",
              phone: "(555) 678-9012",
              status: "new",
              priority: "high",
              source: "Referral",
              assigned_date: "2024-01-18",
              overdue: false,
            },
          ],
        },
      ]

      setLeadsByAssignee(mockLeadData)

      // Calculate total stats
      const stats = {
        total_leads: mockLeadData.reduce((acc, assignee) => acc + assignee.total_leads, 0),
        total_assignees: mockLeadData.length,
        avg_conversion: Math.round(
          mockLeadData.reduce((acc, assignee) => acc + assignee.conversion_rate, 0) / mockLeadData.length,
        ),
        overdue_leads: mockLeadData.reduce((acc, assignee) => acc + assignee.overdue_count, 0),
      }
      setTotalStats(stats)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700"
      case "contacted":
        return "bg-yellow-100 text-yellow-700"
      case "qualified":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lead overview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Lead Overview</h1>
            <p className="text-slate-600">Track lead performance and assignments by team member</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 lg:grid-cols-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Leads</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalStats.total_leads}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Team Members</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalStats.total_assignees}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Conversion</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalStats.avg_conversion}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Overdue</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalStats.overdue_leads}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6">
            <TabsTrigger
              value="overview"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Team Overview
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Lead Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {leadsByAssignee.map((assignee, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{assignee.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{assignee.assignee}</CardTitle>
                          <p className="text-sm text-slate-600">{assignee.total_leads} total leads</p>
                        </div>
                      </div>
                      {assignee.overdue_count > 0 && (
                        <Badge className="bg-red-100 text-red-700 border-0">{assignee.overdue_count} overdue</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-4">
                      {/* Lead Distribution */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-blue-600">{assignee.new_leads}</p>
                          <p className="text-xs text-slate-600">New</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-yellow-600">{assignee.contacted_leads}</p>
                          <p className="text-xs text-slate-600">Contacted</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-green-600">{assignee.qualified_leads}</p>
                          <p className="text-xs text-slate-600">Qualified</p>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-600">Conversion Rate</span>
                            <span className="text-sm font-medium">{assignee.conversion_rate}%</span>
                          </div>
                          <Progress value={assignee.conversion_rate} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Avg Response Time</span>
                          <span className="font-medium">{assignee.avg_response_time}h</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {leadsByAssignee.map((assignee, assigneeIndex) => (
              <Card
                key={assigneeIndex}
                className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">{assignee.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{assignee.assignee}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    {assignee.leads.map((lead) => (
                      <div
                        key={lead.id}
                        className={`p-3 rounded-lg border ${
                          lead.overdue ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{lead.customer_name}</h4>
                            {lead.phone && (
                              <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getPriorityColor(lead.priority)} text-xs border-0 capitalize`}>
                              {lead.priority}
                            </Badge>
                            <Badge className={`${getStatusColor(lead.status)} text-xs border-0 capitalize`}>
                              {lead.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Assigned {new Date(lead.assigned_date).toLocaleDateString()}</span>
                            </div>
                            {lead.last_contact && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Last contact {new Date(lead.last_contact).toLocaleDateString()}</span>
                              </div>
                            )}
                            <Badge className="bg-blue-50 text-blue-700 text-xs border-0">{lead.source}</Badge>
                          </div>
                          {lead.estimated_value && (
                            <span className="font-medium text-emerald-600">{lead.estimated_value}</span>
                          )}
                        </div>
                        {lead.overdue && (
                          <div className="flex items-center gap-1 mt-2 text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            <span className="text-xs font-medium">Requires follow-up</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
