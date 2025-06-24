"use client"

import { useState } from "react"
import {
  Package,
  Truck,
  Calendar,
  MapPin,
  Phone,
  Clock,
  Plus,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Delivery {
  id: string
  customerName: string
  address: string
  phone: string
  items: string[]
  deliveryDate?: string
  timeSlot?: string
  status: "scheduled" | "in-transit" | "delivered" | "pending"
  priority: "low" | "medium" | "high"
  driver?: string
  estimatedValue: string
  specialInstructions?: string
  projectId?: string
}

const mockDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    customerName: "Sarah Johnson",
    address: "123 Oak Street, Springfield",
    phone: "(555) 123-4567",
    items: ["Japanese Maple", "Hostas (12)", "Mulch (5 bags)"],
    deliveryDate: "2025-06-20",
    timeSlot: "9:00 AM - 11:00 AM",
    status: "scheduled",
    priority: "high",
    driver: "Mike Rodriguez",
    estimatedValue: "$450",
    specialInstructions: "Call customer 30 minutes before arrival. Gate code: 1234",
    projectId: "PRJ-001",
  },
  {
    id: "DEL-002",
    customerName: "Robert Thompson",
    address: "456 Maple Avenue, Springfield",
    phone: "(555) 567-8901",
    items: ["Oak Tree (Large)", "Fertilizer", "Irrigation Supplies"],
    deliveryDate: "2025-06-20",
    timeSlot: "1:00 PM - 3:00 PM",
    status: "in-transit",
    priority: "medium",
    driver: "Carlos Garcia",
    estimatedValue: "$850",
    projectId: "PRJ-002",
  },
  {
    id: "DEL-003",
    customerName: "Jennifer Martinez",
    address: "789 Pine Road, Springfield",
    phone: "(555) 345-6789",
    items: ["Pavers (200 sq ft)", "Sand", "Gravel"],
    deliveryDate: "2025-06-19",
    timeSlot: "10:00 AM - 12:00 PM",
    status: "delivered",
    priority: "medium",
    driver: "Tom Wilson",
    estimatedValue: "$1,200",
    projectId: "PRJ-003",
  },
  {
    id: "DEL-004",
    customerName: "Mountain View HOA",
    address: "789 Mountain View Dr, Springfield",
    phone: "(555) 987-6543",
    items: ["Shrubs (25)", "Topsoil (10 yards)", "Sprinkler Heads"],
    status: "pending",
    priority: "low",
    estimatedValue: "$650",
    specialInstructions: "Coordinate with property manager. Large delivery area available.",
    projectId: "PRJ-004",
  },
]

export function DeliveryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("scheduled")

  const getStatusCounts = () => {
    return {
      scheduled: mockDeliveries.filter((d) => d.status === "scheduled").length,
      inTransit: mockDeliveries.filter((d) => d.status === "in-transit").length,
      delivered: mockDeliveries.filter((d) => d.status === "delivered").length,
      pending: mockDeliveries.filter((d) => d.status === "pending").length,
    }
  }

  const statusCounts = getStatusCounts()

  const filteredDeliveries = mockDeliveries.filter((delivery) => {
    const matchesSearch =
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      delivery.status === activeTab ||
      (activeTab === "in-transit" && delivery.status === "in-transit")

    return matchesSearch && matchesTab
  })

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Delivery Management</h1>
            <p className="text-slate-600">Schedule, track, and manage material deliveries</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-12 px-4 text-base font-medium rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            >
              <Link href="/calendar">
                <Calendar className="mr-2 h-5 w-5" />
                Delivery Calendar
              </Link>
            </Button>
            <Button
              size="sm"
              className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none w-full lg:w-auto"
            >
              <Plus className="mr-2 h-5 w-5" />
              Schedule Delivery
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Today's Deliveries</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {statusCounts.scheduled + statusCounts.inTransit}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">In Transit</p>
                  <p className="text-2xl font-semibold text-slate-900">{statusCounts.inTransit}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Completed Today</p>
                  <p className="text-2xl font-semibold text-slate-900">{statusCounts.delivered}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Pending Schedule</p>
                  <p className="text-2xl font-semibold text-slate-900">{statusCounts.pending}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Driver Status Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Driver Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                <DriverStatusCard
                  name="Mike Rodriguez"
                  status="active"
                  currentDelivery="Sarah Johnson"
                  deliveriesCompleted={2}
                  deliveriesRemaining={1}
                />
                <DriverStatusCard
                  name="Carlos Garcia"
                  status="active"
                  currentDelivery="Robert Thompson"
                  deliveriesCompleted={1}
                  deliveriesRemaining={2}
                />
                <DriverStatusCard
                  name="Tom Wilson"
                  status="available"
                  deliveriesCompleted={3}
                  deliveriesRemaining={0}
                />
                <DriverStatusCard
                  name="James Chen"
                  status="available"
                  deliveriesCompleted={1}
                  deliveriesRemaining={0}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 lg:w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search deliveries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
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
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full grid grid-cols-4">
                    <TabsTrigger
                      value="scheduled"
                      className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                    >
                      Scheduled ({statusCounts.scheduled})
                    </TabsTrigger>
                    <TabsTrigger
                      value="in-transit"
                      className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                    >
                      In Transit ({statusCounts.inTransit})
                    </TabsTrigger>
                    <TabsTrigger
                      value="delivered"
                      className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                    >
                      Delivered ({statusCounts.delivered})
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="px-2 py-2 text-xs lg:text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                    >
                      Pending ({statusCounts.pending})
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6 space-y-4">
                    {filteredDeliveries.map((delivery) => (
                      <DeliveryCard key={delivery.id} delivery={delivery} />
                    ))}
                    {filteredDeliveries.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No deliveries found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DriverStatusCardProps {
  name: string
  status: "active" | "available" | "unavailable"
  currentDelivery?: string
  deliveriesCompleted: number
  deliveriesRemaining: number
}

function DriverStatusCard({
  name,
  status,
  currentDelivery,
  deliveriesCompleted,
  deliveriesRemaining,
}: DriverStatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-yellow-500"
      case "available":
        return "bg-green-500"
      case "unavailable":
        return "bg-red-500"
    }
  }

  const workloadPercentage =
    deliveriesCompleted > 0 ? (deliveriesCompleted / (deliveriesCompleted + deliveriesRemaining)) * 100 : 0

  return (
    <div className="p-3 border border-slate-200 rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-sm text-slate-900">{name}</p>
          <p className="text-xs text-slate-500 capitalize">{status}</p>
        </div>
        <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
      </div>

      {currentDelivery && (
        <div className="mb-2">
          <p className="text-xs text-slate-500">Current Delivery:</p>
          <p className="text-xs font-medium text-slate-900 truncate">{currentDelivery}</p>
        </div>
      )}

      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Today's Progress</span>
          <span className="text-slate-900">
            {deliveriesCompleted}/{deliveriesCompleted + deliveriesRemaining}
          </span>
        </div>
        <Progress value={workloadPercentage} className="h-1.5" />
      </div>

      <div className="text-xs text-slate-500">
        {deliveriesRemaining > 0 ? `${deliveriesRemaining} remaining` : "All deliveries complete"}
      </div>
    </div>
  )
}

interface DeliveryCardProps {
  delivery: Delivery
}

function DeliveryCard({ delivery }: DeliveryCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50/30"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50/30"
      case "low":
        return "border-l-blue-500 bg-blue-50/30"
      default:
        return "border-l-slate-300"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0">
            Scheduled
          </Badge>
        )
      case "in-transit":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-xs px-2 py-1 rounded-md font-medium border-0">
            In Transit
          </Badge>
        )
      case "delivered":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-xs px-2 py-1 rounded-md font-medium border-0">
            Delivered
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-red-50 text-red-700 hover:bg-red-50 text-xs px-2 py-1 rounded-md font-medium border-0">
            Pending
          </Badge>
        )
    }
  }

  return (
    <div
      className={`p-4 border border-slate-200 rounded-lg border-l-4 ${getPriorityColor(delivery.priority)} hover:border-slate-300 transition-colors`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{delivery.customerName}</h3>
            {delivery.priority === "high" && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{delivery.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <Phone className="h-3 w-3" />
            <span>{delivery.phone}</span>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
          {getStatusBadge(delivery.status)}
          <div className="text-lg font-semibold text-emerald-600">{delivery.estimatedValue}</div>
        </div>
      </div>

      {delivery.deliveryDate && delivery.timeSlot && (
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(delivery.deliveryDate).toLocaleDateString()} • {delivery.timeSlot}
          </span>
          {delivery.driver && (
            <>
              <span className="text-slate-400">•</span>
              <span>Driver: {delivery.driver}</span>
            </>
          )}
        </div>
      )}

      <div className="mb-3">
        <p className="text-xs font-medium text-slate-700 mb-2">Items:</p>
        <div className="flex flex-wrap gap-1">
          {delivery.items.map((item, index) => (
            <Badge
              key={index}
              className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {delivery.specialInstructions && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-xs font-medium text-blue-900 mb-1">Special Instructions:</div>
          <div className="text-xs text-blue-800">{delivery.specialInstructions}</div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {delivery.projectId && (
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link href={`/jobs/${delivery.projectId}`}>Project: {delivery.projectId}</Link>
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
            Track
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg border-slate-200">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Delivery</DropdownMenuItem>
              <DropdownMenuItem>Reschedule</DropdownMenuItem>
              <DropdownMenuItem>Contact Customer</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
