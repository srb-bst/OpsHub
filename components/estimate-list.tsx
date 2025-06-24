"use client"

import { useState } from "react"
import {
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Eye,
  Send,
  Edit,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Estimate {
  id: string
  estimateNumber: string
  customerName: string
  projectTitle: string
  blueSheetId: string
  status: "draft" | "internal-review" | "sent-to-customer" | "under-negotiation" | "approved" | "rejected" | "expired"
  totalAmount: string
  createdDate: string
  sentDate?: string
  responseDate?: string
  expiryDate: string
  estimator: string
  estimatorInitials: string
  priority: "low" | "medium" | "high"
  customerEmail: string
  customerPhone: string
  projectType: string
  services: string[]
  revisionCount: number
  lastActivity: string
  daysInStage: number
}

const mockEstimates: Estimate[] = [
  {
    id: "1",
    estimateNumber: "EST-2025-001",
    customerName: "Sarah Johnson",
    projectTitle: "Front Yard Redesign",
    blueSheetId: "bs-001",
    status: "sent-to-customer",
    totalAmount: "$15,500",
    createdDate: "2025-06-15",
    sentDate: "2025-06-16",
    expiryDate: "2025-07-16",
    estimator: "Emma Thompson",
    estimatorInitials: "ET",
    priority: "high",
    customerEmail: "sarah.johnson@email.com",
    customerPhone: "(555) 123-4567",
    projectType: "Residential",
    services: ["Design", "Installation"],
    revisionCount: 0,
    lastActivity: "Sent to customer",
    daysInStage: 2,
  },
  {
    id: "2",
    estimateNumber: "EST-2025-002",
    customerName: "Jennifer Martinez",
    projectTitle: "Backyard Renovation",
    blueSheetId: "bs-002",
    status: "under-negotiation",
    totalAmount: "$35,000",
    createdDate: "2025-06-12",
    sentDate: "2025-06-13",
    responseDate: "2025-06-15",
    expiryDate: "2025-07-13",
    estimator: "Emma Thompson",
    estimatorInitials: "ET",
    priority: "high",
    customerEmail: "jennifer.martinez@email.com",
    customerPhone: "(555) 345-6789",
    projectType: "Residential",
    services: ["Design", "Hardscape", "Installation"],
    revisionCount: 1,
    lastActivity: "Customer requested changes",
    daysInStage: 3,
  },
  {
    id: "3",
    estimateNumber: "EST-2025-003",
    customerName: "Mountain View HOA",
    projectTitle: "Community Landscaping",
    blueSheetId: "bs-003",
    status: "approved",
    totalAmount: "$28,000",
    createdDate: "2025-06-10",
    sentDate: "2025-06-11",
    responseDate: "2025-06-14",
    expiryDate: "2025-07-11",
    estimator: "David Chen",
    estimatorInitials: "DC",
    priority: "medium",
    customerEmail: "board@mountainviewhoa.com",
    customerPhone: "(555) 987-6543",
    projectType: "Commercial",
    services: ["Installation", "Maintenance"],
    revisionCount: 0,
    lastActivity: "Approved by customer",
    daysInStage: 4,
  },
  {
    id: "4",
    estimateNumber: "EST-2025-004",
    customerName: "Robert Thompson",
    projectTitle: "Garden Design Consultation",
    blueSheetId: "bs-004",
    status: "draft",
    totalAmount: "$8,500",
    createdDate: "2025-06-17",
    expiryDate: "2025-07-17",
    estimator: "Emma Thompson",
    estimatorInitials: "ET",
    priority: "medium",
    customerEmail: "robert.thompson@email.com",
    customerPhone: "(555) 234-5678",
    projectType: "Residential",
    services: ["Design", "Consultation"],
    revisionCount: 0,
    lastActivity: "Draft created",
    daysInStage: 1,
  },
  {
    id: "5",
    estimateNumber: "EST-2025-005",
    customerName: "City of Springfield",
    projectTitle: "Downtown Beautification",
    blueSheetId: "bs-005",
    status: "internal-review",
    totalAmount: "$125,000",
    createdDate: "2025-06-14",
    expiryDate: "2025-08-14",
    estimator: "David Chen",
    estimatorInitials: "DC",
    priority: "high",
    customerEmail: "projects@springfield.gov",
    customerPhone: "(555) 456-7890",
    projectType: "Municipal",
    services: ["Design", "Installation", "Maintenance"],
    revisionCount: 0,
    lastActivity: "Pending internal review",
    daysInStage: 4,
  },
  {
    id: "6",
    estimateNumber: "EST-2025-006",
    customerName: "Anderson Residence",
    projectTitle: "Patio Installation",
    blueSheetId: "bs-006",
    status: "rejected",
    totalAmount: "$12,000",
    createdDate: "2025-06-08",
    sentDate: "2025-06-09",
    responseDate: "2025-06-12",
    expiryDate: "2025-07-09",
    estimator: "Emma Thompson",
    estimatorInitials: "ET",
    priority: "low",
    customerEmail: "mary.anderson@email.com",
    customerPhone: "(555) 345-6789",
    projectType: "Residential",
    services: ["Hardscape", "Installation"],
    revisionCount: 1,
    lastActivity: "Rejected by customer",
    daysInStage: 6,
  },
]

export function EstimateList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const getStatusCounts = () => {
    return {
      all: mockEstimates.length,
      draft: mockEstimates.filter((e) => e.status === "draft").length,
      review: mockEstimates.filter((e) => e.status === "internal-review").length,
      sent: mockEstimates.filter((e) => e.status === "sent-to-customer").length,
      negotiation: mockEstimates.filter((e) => e.status === "under-negotiation").length,
      approved: mockEstimates.filter((e) => e.status === "approved").length,
      rejected: mockEstimates.filter((e) => e.status === "rejected").length,
    }
  }

  const statusCounts = getStatusCounts()

  const filteredEstimates = mockEstimates.filter((estimate) => {
    const matchesSearch =
      estimate.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = activeTab === "all" || estimate.status === getStatusFromTab(activeTab)
    const matchesPriority = priorityFilter === "all" || estimate.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  function getStatusFromTab(tab: string) {
    const statusMap: { [key: string]: string } = {
      draft: "draft",
      review: "internal-review",
      sent: "sent-to-customer",
      negotiation: "under-negotiation",
      approved: "approved",
      rejected: "rejected",
    }
    return statusMap[tab] || ""
  }

  const getPipelineMetrics = () => {
    const totalValue = mockEstimates
      .filter((e) => !["rejected", "expired"].includes(e.status))
      .reduce((sum, e) => sum + Number.parseFloat(e.totalAmount.replace(/[$,]/g, "")), 0)

    const approvedValue = mockEstimates
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + Number.parseFloat(e.totalAmount.replace(/[$,]/g, "")), 0)

    const pendingCount = mockEstimates.filter((e) =>
      ["sent-to-customer", "under-negotiation"].includes(e.status),
    ).length

    const conversionRate = mockEstimates.length > 0 ? (statusCounts.approved / mockEstimates.length) * 100 : 0

    return {
      totalValue: `$${totalValue.toLocaleString()}`,
      approvedValue: `$${approvedValue.toLocaleString()}`,
      pendingCount,
      conversionRate: `${conversionRate.toFixed(0)}%`,
    }
  }

  const metrics = getPipelineMetrics()

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Estimate Management</h1>
            <p className="text-slate-600">Track estimates from creation to customer approval</p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none w-full lg:w-auto"
          >
            <Link href="/estimates/new">
              <Plus className="mr-2 h-5 w-5" />
              New Estimate
            </Link>
          </Button>
        </div>

        {/* Pipeline Metrics */}
        <div className="grid gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
          <MetricCard
            title="Pipeline Value"
            value={metrics.totalValue}
            subtitle="Active estimates"
            icon={DollarSign}
            color="emerald"
          />
          <MetricCard
            title="Approved Value"
            value={metrics.approvedValue}
            subtitle="Ready for scheduling"
            icon={CheckCircle2}
            color="green"
          />
          <MetricCard
            title="Pending Response"
            value={metrics.pendingCount.toString()}
            subtitle="Awaiting customer"
            icon={Clock}
            color="yellow"
          />
          <MetricCard
            title="Conversion Rate"
            value={metrics.conversionRate}
            subtitle="Approval success"
            icon={TrendingUp}
            color="blue"
          />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search estimates, customers, or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[140px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
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

        {/* Estimate Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-3 lg:grid-cols-7">
            <TabsTrigger
              value="all"
              className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Draft ({statusCounts.draft})
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Review ({statusCounts.review})
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Sent ({statusCounts.sent})
            </TabsTrigger>
            <TabsTrigger
              value="negotiation"
              className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Negotiation ({statusCounts.negotiation})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Approved ({statusCounts.approved})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Rejected ({statusCounts.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardContent className="p-4 lg:p-6 space-y-4">
                {filteredEstimates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No estimates found</h3>
                    <p className="text-slate-500 mb-6">
                      {searchTerm ? "Try adjusting your search criteria" : "Create your first estimate to get started"}
                    </p>
                    <Button asChild className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                      <Link href="/estimates/new">Create New Estimate</Link>
                    </Button>
                  </div>
                ) : (
                  filteredEstimates.map((estimate) => <EstimateCard key={estimate.id} estimate={estimate} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  icon: any
  color: "emerald" | "green" | "yellow" | "blue"
}

function MetricCard({ title, value, subtitle, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none p-4 lg:p-5">
      <CardHeader className="flex flex-row items-center justify-between pb-2 lg:pb-3 p-0">
        <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">{title}</CardTitle>
        <div className={`h-6 w-6 lg:h-8 lg:w-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-xl lg:text-2xl font-semibold text-slate-900 mb-1">{value}</div>
        <p className="text-xs lg:text-sm text-slate-500">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

interface EstimateCardProps {
  estimate: Estimate
}

function EstimateCard({ estimate }: EstimateCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-700"
      case "internal-review":
        return "bg-blue-100 text-blue-700"
      case "sent-to-customer":
        return "bg-purple-100 text-purple-700"
      case "under-negotiation":
        return "bg-yellow-100 text-yellow-700"
      case "approved":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "expired":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft"
      case "internal-review":
        return "Internal Review"
      case "sent-to-customer":
        return "Sent to Customer"
      case "under-negotiation":
        return "Under Negotiation"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "expired":
        return "Expired"
      default:
        return status
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

  const isUrgent = estimate.daysInStage > 7 && ["sent-to-customer", "under-negotiation"].includes(estimate.status)

  return (
    <div
      className={`p-4 border rounded-lg hover:border-slate-300 transition-colors ${
        isUrgent ? "border-orange-200 bg-orange-50/30" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-900">{estimate.customerName}</h3>
            <div className={`h-2 w-2 rounded-full ${getPriorityColor(estimate.priority)}`} />
            {isUrgent && <AlertCircle className="h-4 w-4 text-orange-500" />}
          </div>
          <p className="text-sm text-slate-600 mb-1">{estimate.projectTitle}</p>
          <p className="text-xs text-slate-500">{estimate.estimateNumber}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-emerald-600 mb-1">{estimate.totalAmount}</div>
          <Badge className={`${getStatusColor(estimate.status)} text-xs px-2 py-1 rounded-md font-medium border-0`}>
            {getStatusLabel(estimate.status)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {estimate.services.map((service) => (
          <Badge
            key={service}
            className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
          >
            {service}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-slate-400" />
          <span className="text-slate-600">{estimate.estimator}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-slate-400" />
          <span className="text-slate-600">{new Date(estimate.createdDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-slate-400" />
          <span className="text-slate-600">{estimate.daysInStage} days in stage</span>
        </div>
        {estimate.revisionCount > 0 && (
          <div className="flex items-center gap-2">
            <Edit className="h-3 w-3 text-slate-400" />
            <span className="text-slate-600">{estimate.revisionCount} revision(s)</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="font-medium">Last activity:</span> {estimate.lastActivity}
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
            <Link href={`/blue-sheets/${estimate.blueSheetId}`}>
              <FileText className="mr-1 h-3 w-3" />
              Blue Sheet
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
            <Link href={`/estimates/${estimate.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              View
            </Link>
          </Button>
          {estimate.status === "approved" && (
            <Button asChild size="sm" className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 rounded-lg">
              <Link href="/scheduling">
                <Calendar className="mr-1 h-3 w-3" />
                Schedule
              </Link>
            </Button>
          )}
          {["draft", "internal-review"].includes(estimate.status) && (
            <Button asChild size="sm" className="h-8 px-3 text-xs bg-blue-500 hover:bg-blue-600 rounded-lg">
              <Link href={`/estimates/${estimate.id}`}>
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Link>
            </Button>
          )}
          {estimate.status === "sent-to-customer" && (
            <Button size="sm" className="h-8 px-3 text-xs bg-purple-500 hover:bg-purple-600 rounded-lg">
              <Send className="mr-1 h-3 w-3" />
              Follow Up
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
