"use client"

import { useEffect, useState } from "react"
import { DollarSign, Clock, CheckCircle2, Plus, Search, Calendar, FileText, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

interface Estimate {
  id: string
  design_project_id: string
  estimate_number: string
  customer_name: string
  project_title: string
  status: string
  total_amount: number
  created_at: string
}

export function EstimateList() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchEstimates()
  }, [])

  const fetchEstimates = async () => {
    try {
      console.log("🔄 Fetching estimates...")

      const { data, error } = await supabase.from("estimates").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Estimate fetch error:", error)
        throw error
      }

      console.log("✅ Estimates fetched:", data?.length || 0)
      setEstimates(data || [])
    } catch (error) {
      console.error("❌ Error fetching estimates:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusCounts = () => {
    return {
      all: estimates.length,
      draft: estimates.filter((e) => e.status === "draft").length,
      review: estimates.filter((e) => e.status === "internal-review").length,
      sent: estimates.filter((e) => e.status === "sent-to-customer").length,
      negotiation: estimates.filter((e) => e.status === "under-negotiation").length,
      approved: estimates.filter((e) => e.status === "approved").length,
      rejected: estimates.filter((e) => e.status === "rejected").length,
    }
  }

  const statusCounts = getStatusCounts()

  const filteredEstimates = estimates.filter((estimate) => {
    const matchesSearch =
      estimate.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.estimate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estimate.project_title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = activeTab === "all" || estimate.status === getStatusFromTab(activeTab)

    return matchesSearch && matchesStatus
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
    const totalValue = estimates
      .filter((e) => !["rejected", "expired"].includes(e.status))
      .reduce((sum, e) => sum + (e.total_amount || 0), 0)

    const approvedValue = estimates
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + (e.total_amount || 0), 0)

    const pendingCount = estimates.filter((e) => ["sent-to-customer", "under-negotiation"].includes(e.status)).length

    const conversionRate = estimates.length > 0 ? (statusCounts.approved / estimates.length) * 100 : 0

    return {
      totalValue: `$${totalValue.toLocaleString()}`,
      approvedValue: `$${approvedValue.toLocaleString()}`,
      pendingCount,
      conversionRate: `${conversionRate.toFixed(0)}%`,
    }
  }

  const metrics = getPipelineMetrics()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading estimates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm mb-4">
          <strong>🔍 Debug:</strong> Found {estimates.length} estimates
        </div>

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
      default:
        return status
    }
  }

  return (
    <div className="p-4 border rounded-lg hover:border-slate-300 transition-colors border-slate-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-900">{estimate.customer_name}</h3>
          </div>
          <p className="text-sm text-slate-600 mb-1">{estimate.project_title}</p>
          <p className="text-xs text-slate-500">{estimate.estimate_number}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-emerald-600 mb-1">
            ${(estimate.total_amount || 0).toLocaleString()}
          </div>
          <Badge className={`${getStatusColor(estimate.status)} text-xs px-2 py-1 rounded-md font-medium border-0`}>
            {getStatusLabel(estimate.status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-slate-400" />
          <span className="text-slate-600">{new Date(estimate.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="font-medium">Status:</span> {getStatusLabel(estimate.status)}
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  )
}
