"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, CircleDashed, ClipboardList, Plus, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

interface DesignProject {
  id: string
  customer_id: string
  title: string
  status: string
  project_type: string
  area: string
  created_at: string
}

interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
}

export function DesignList() {
  const [designs, setDesigns] = useState<DesignProject[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log("🔄 Fetching designs and customers...")

      const [designsResponse, customersResponse] = await Promise.all([
        supabase.from("design_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("*"),
      ])

      if (designsResponse.error) {
        console.error("❌ Design fetch error:", designsResponse.error)
        throw designsResponse.error
      }
      if (customersResponse.error) {
        console.error("❌ Customer fetch error:", customersResponse.error)
        throw customersResponse.error
      }

      console.log("✅ Designs fetched:", designsResponse.data?.length || 0)
      console.log("✅ Customers fetched:", customersResponse.data?.length || 0)

      setDesigns(designsResponse.data || [])
      setCustomers(customersResponse.data || [])
    } catch (error) {
      console.error("❌ Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCustomerById = (customerId: string) => {
    return customers.find((c) => c.id === customerId)
  }

  const filteredDesigns = designs.filter((design) => {
    const customer = getCustomerById(design.customer_id)
    const customerName = customer ? `${customer.first_name} ${customer.last_name}` : ""

    const matchesSearch =
      design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || design.project_type === typeFilter

    return matchesSearch && matchesType
  })

  const getDesignsByStatus = (status: string) => {
    if (status === "all") return filteredDesigns
    return filteredDesigns.filter((design) => design.status === status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading designs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <strong>🔍 Debug:</strong> Found {designs.length} designs, {customers.length} customers
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search designs..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="municipal">Municipal</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/designs/new">
              <Plus className="mr-2 h-4 w-4" />
              New Design
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Designs ({filteredDesigns.length})</TabsTrigger>
          <TabsTrigger value="needs-estimate">
            Needs Estimate ({getDesignsByStatus("needs-estimate").length})
          </TabsTrigger>
          <TabsTrigger value="pending-approval">
            Pending Approval ({getDesignsByStatus("pending-approval").length})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({getDesignsByStatus("approved").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {getDesignsByStatus("all").map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  customer={getCustomerById(design.customer_id)}
                  onUpdate={fetchData}
                />
              ))}
              {getDesignsByStatus("all").length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">No designs found</p>
                  <Button asChild>
                    <Link href="/designs/new">Create First Design</Link>
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="needs-estimate" className="space-y-4 mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {getDesignsByStatus("needs-estimate").map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  customer={getCustomerById(design.customer_id)}
                  onUpdate={fetchData}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="pending-approval" className="space-y-4 mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {getDesignsByStatus("pending-approval").map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  customer={getCustomerById(design.customer_id)}
                  onUpdate={fetchData}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {getDesignsByStatus("approved").map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  customer={getCustomerById(design.customer_id)}
                  onUpdate={fetchData}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DesignCardProps {
  design: DesignProject
  customer?: Customer
  onUpdate: () => void
}

function DesignCard({ design, customer, onUpdate }: DesignCardProps) {
  const customerName = customer ? `${customer.first_name} ${customer.last_name}` : "Unknown Customer"

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{design.title}</CardTitle>
          {design.status === "needs-estimate" && (
            <Badge>
              <CircleDashed className="mr-1 h-3 w-3" />
              Needs Estimate
            </Badge>
          )}
          {design.status === "pending-approval" && (
            <Badge variant="outline">
              <ClipboardList className="mr-1 h-3 w-3" />
              Pending Approval
            </Badge>
          )}
          {design.status === "approved" && (
            <Badge variant="secondary">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Approved
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm">
            <span className="font-medium">Customer:</span> {customerName}
          </div>
          <div className="text-sm text-muted-foreground">{customer?.address}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Type:</span> {design.project_type}
            </div>
            <div>
              <span className="font-medium">Area:</span> {design.area}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Created {new Date(design.created_at).toLocaleDateString()}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {design.status === "needs-estimate" && (
              <Button size="sm" asChild>
                <Link href={`/estimates/new?design=${design.id}`}>Create Estimate</Link>
              </Button>
            )}
            {design.status === "pending-approval" && (
              <Button size="sm" variant="outline" asChild>
                <Link href="/estimates">Check Estimates</Link>
              </Button>
            )}
            {design.status === "approved" && (
              <Button size="sm" asChild>
                <Link href="/scheduling">Schedule Job</Link>
              </Button>
            )}
            <Button size="sm" variant="outline" asChild>
              <Link href={`/designs/${design.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
