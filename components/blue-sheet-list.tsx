"use client"

import { useState } from "react"
import {
  Filter,
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  DollarSign,
  Palette,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BlueSheet {
  id: string
  customerName: string
  address: string
  designer: string
  designerInitials: string
  status: "draft" | "in-progress" | "ready-for-estimate" | "estimated" | "approved" | "completed" | "pending-design"
  priority: "low" | "medium" | "high"
  services: string[]
  lastUpdated: string
  estimatedValue?: string
  consultationDate?: string
  photos: number
  notes: number
  completionPercentage: number
  designStatus?: "waiting" | "in-progress" | "complete"
}

const blueSheets: BlueSheet[] = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    address: "123 Oak Street, Springfield",
    designer: "Emma Thompson",
    designerInitials: "ET",
    status: "pending-design",
    priority: "high",
    services: ["Design", "Installation"],
    lastUpdated: "2 hours ago",
    consultationDate: "Today, 2:00 PM",
    photos: 8,
    notes: 3,
    completionPercentage: 25,
    designStatus: "waiting",
  },
  {
    id: "2",
    customerName: "Jennifer Martinez",
    address: "789 Pine Road, Springfield",
    designer: "Emma Thompson",
    designerInitials: "ET",
    status: "pending-design",
    priority: "high",
    services: ["Design", "Hardscape"],
    lastUpdated: "1 day ago",
    photos: 12,
    notes: 5,
    completionPercentage: 40,
    designStatus: "waiting",
  },
  {
    id: "3",
    customerName: "Robert Wilson",
    address: "321 Cedar Lane, Springfield",
    designer: "David Kim",
    designerInitials: "DK",
    status: "pending-design",
    priority: "medium",
    services: ["Design", "Installation"],
    lastUpdated: "3 days ago",
    consultationDate: "Tomorrow, 10:00 AM",
    photos: 2,
    notes: 1,
    completionPercentage: 15,
    designStatus: "waiting",
  },
  {
    id: "4",
    customerName: "Lisa Anderson",
    address: "654 Birch Avenue, Springfield",
    designer: "David Kim",
    designerInitials: "DK",
    status: "pending-design",
    priority: "high",
    services: ["Design", "Maintenance"],
    lastUpdated: "5 days ago",
    photos: 6,
    notes: 4,
    completionPercentage: 30,
    designStatus: "waiting",
  },
  {
    id: "5",
    customerName: "Thomas Garcia",
    address: "987 Elm Street, Springfield",
    designer: "Sarah Martinez",
    designerInitials: "SM",
    status: "pending-design",
    priority: "high",
    services: ["Design", "Installation", "Irrigation"],
    lastUpdated: "1 week ago",
    photos: 15,
    notes: 8,
    completionPercentage: 20,
    designStatus: "waiting",
  },
  {
    id: "6",
    customerName: "Michael Brown",
    address: "456 Elm Avenue, Springfield",
    designer: "Emma Thompson",
    designerInitials: "ET",
    status: "ready-for-estimate",
    priority: "medium",
    services: ["Design", "Installation"],
    lastUpdated: "2 days ago",
    estimatedValue: "$18,500",
    photos: 10,
    notes: 6,
    completionPercentage: 90,
    designStatus: "complete",
  },
]

export function BlueSheetList() {
  const searchParams = useSearchParams()
  const urlFilter = searchParams.get("filter")
  const [selectedDesigner, setSelectedDesigner] = useState<string>("all")

  const filteredSheets =
    selectedDesigner === "all" ? blueSheets : blueSheets.filter((sheet) => sheet.designer === selectedDesigner)

  // Filter for pending design specifically
  const getPendingDesignSheets = () => {
    return filteredSheets.filter((sheet) => sheet.designStatus === "waiting")
  }

  const getStatusCounts = () => {
    return {
      draft: filteredSheets.filter((s) => s.status === "draft").length,
      inProgress: filteredSheets.filter((s) => s.status === "in-progress").length,
      readyForEstimate: filteredSheets.filter((s) => s.status === "ready-for-estimate").length,
      estimated: filteredSheets.filter((s) => s.status === "estimated").length,
      approved: filteredSheets.filter((s) => s.status === "approved").length,
      pendingDesign: getPendingDesignSheets().length,
    }
  }

  const statusCounts = getStatusCounts()
  const isPendingDesignFilter = urlFilter === "pending-design"

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        {/* Alert banner for pending design filter */}
        {isPendingDesignFilter && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Palette className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Design Attention Required:</strong> Showing {getPendingDesignSheets().length} blue sheets waiting
              for design completion
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">
              {isPendingDesignFilter ? "Pending Designs" : "Blue Sheets"}
            </h1>
            <p className="text-slate-600">
              {isPendingDesignFilter
                ? "Projects waiting for design completion"
                : "Designer project documentation and development"}
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none w-full lg:w-auto"
          >
            <Link href="/blue-sheets/new">
              <Plus className="mr-2 h-5 w-5" />
              New Blue Sheet
            </Link>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search blue sheets..."
              className="pl-10 h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedDesigner} onValueChange={setSelectedDesigner}>
              <SelectTrigger className="w-full lg:w-[160px] h-12 text-base rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Designer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designers</SelectItem>
                <SelectItem value="Emma Thompson">Emma Thompson</SelectItem>
                <SelectItem value="David Kim">David Kim</SelectItem>
                <SelectItem value="Sarah Martinez">Sarah Martinez</SelectItem>
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
        {isPendingDesignFilter ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Projects Waiting for Design ({getPendingDesignSheets().length})
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/blue-sheets">View All Blue Sheets</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              {getPendingDesignSheets().map((sheet) => (
                <BlueSheetCard key={sheet.id} blueSheet={sheet} showDesignWarning={true} />
              ))}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-3 lg:grid-cols-6">
              <TabsTrigger
                value="all"
                className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                All ({filteredSheets.length})
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Draft ({statusCounts.draft})
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                In Progress ({statusCounts.inProgress})
              </TabsTrigger>
              <TabsTrigger
                value="ready-for-estimate"
                className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Ready ({statusCounts.readyForEstimate})
              </TabsTrigger>
              <TabsTrigger
                value="estimated"
                className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Estimated ({statusCounts.estimated})
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Approved ({statusCounts.approved})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4">
                {filteredSheets.map((sheet) => (
                  <BlueSheetCard key={sheet.id} blueSheet={sheet} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="draft" className="space-y-4">
              <div className="grid gap-4">
                {filteredSheets
                  .filter((sheet) => sheet.status === "draft")
                  .map((sheet) => (
                    <BlueSheetCard key={sheet.id} blueSheet={sheet} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              <div className="grid gap-4">
                {filteredSheets
                  .filter((sheet) => sheet.status === "in-progress")
                  .map((sheet) => (
                    <BlueSheetCard key={sheet.id} blueSheet={sheet} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="ready-for-estimate" className="space-y-4">
              <div className="grid gap-4">
                {filteredSheets
                  .filter((sheet) => sheet.status === "ready-for-estimate")
                  .map((sheet) => (
                    <BlueSheetCard key={sheet.id} blueSheet={sheet} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="estimated" className="space-y-4">
              <div className="grid gap-4">
                {filteredSheets
                  .filter((sheet) => sheet.status === "estimated")
                  .map((sheet) => (
                    <BlueSheetCard key={sheet.id} blueSheet={sheet} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="grid gap-4">
                {filteredSheets
                  .filter((sheet) => sheet.status === "approved")
                  .map((sheet) => (
                    <BlueSheetCard key={sheet.id} blueSheet={sheet} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

interface BlueSheetCardProps {
  blueSheet: BlueSheet
  showDesignWarning?: boolean
}

function BlueSheetCard({ blueSheet, showDesignWarning = false }: BlueSheetCardProps) {
  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none hover:bg-white transition-all ${
        showDesignWarning ? "border-l-4 border-l-yellow-500" : ""
      }`}
    >
      <CardContent className="p-4 lg:p-6">
        {showDesignWarning && (
          <div className="flex items-center gap-2 mb-3 text-yellow-600">
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">Waiting for design completion</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{blueSheet.customerName}</h3>
              <p className="text-sm text-slate-500">{blueSheet.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {blueSheet.priority === "high" && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
            {blueSheet.priority === "medium" && <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>}
            {blueSheet.priority === "low" && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
            {blueSheet.estimatedValue && (
              <span className="text-lg font-semibold text-emerald-600">{blueSheet.estimatedValue}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm bg-slate-100">{blueSheet.designerInitials}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-slate-600">{blueSheet.designer}</span>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Clock className="h-3 w-3" />
            {blueSheet.lastUpdated}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {blueSheet.services.map((service) => (
            <Badge
              key={service}
              className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
            >
              {service}
            </Badge>
          ))}
        </div>

        {blueSheet.status !== "draft" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Completion</span>
              <span className="font-medium text-slate-900">{blueSheet.completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${blueSheet.completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Camera className="h-4 w-4" />
              {blueSheet.photos} photos
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <FileText className="h-4 w-4" />
              {blueSheet.notes} notes
            </div>
            {blueSheet.consultationDate && (
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                {blueSheet.consultationDate}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {blueSheet.status === "pending-design" && (
              <>
                {showDesignWarning && (
                  <Button size="sm" className="h-8 px-3 text-xs bg-yellow-500 hover:bg-yellow-600 rounded-lg">
                    Start Design
                  </Button>
                )}
                <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                  <Palette className="mr-1 h-3 w-3" />
                  Pending Design
                </Badge>
              </>
            )}
            {blueSheet.status === "draft" && (
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0">
                Draft
              </Badge>
            )}
            {blueSheet.status === "in-progress" && (
              <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                <Clock className="mr-1 h-3 w-3" />
                In Progress
              </Badge>
            )}
            {blueSheet.status === "ready-for-estimate" && (
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                <DollarSign className="mr-1 h-3 w-3" />
                Ready for Estimate
              </Badge>
            )}
            {blueSheet.status === "estimated" && (
              <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Awaiting Approval
              </Badge>
            )}
            {blueSheet.status === "approved" && (
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-xs px-2 py-1 rounded-md font-medium border-0">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Approved
              </Badge>
            )}
            <Button asChild size="sm" className="h-8 px-3 text-xs bg-slate-900 hover:bg-slate-800 rounded-lg">
              <Link href={`/blue-sheets/${blueSheet.id}`}>View</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
