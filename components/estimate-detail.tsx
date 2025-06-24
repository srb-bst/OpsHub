"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  Edit,
  Send,
  Download,
  MessageSquare,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/file-upload"

interface EstimateDetailProps {
  estimateId: string
}

export function EstimateDetail({ estimateId }: EstimateDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")

  // Mock data - would come from API
  const estimate = {
    id: estimateId,
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
    customerAddress: "123 Oak Street, Springfield, IL 62701",
    projectType: "Residential",
    services: ["Design", "Installation"],
    revisionCount: 0,
    lastActivity: "Sent to customer",
    daysInStage: 2,
    lineItems: [
      {
        id: "1",
        category: "Plants & Materials",
        description: "Japanese Maple Trees (6-8 ft)",
        quantity: 2,
        unit: "each",
        unitPrice: 450,
        total: 900,
      },
      {
        id: "2",
        category: "Plants & Materials",
        description: "Boxwood Hedge Plants (18-24 in)",
        quantity: 15,
        unit: "each",
        unitPrice: 35,
        total: 525,
      },
      {
        id: "3",
        category: "Labor",
        description: "Site Preparation and Planting",
        quantity: 16,
        unit: "hour",
        unitPrice: 65,
        total: 1040,
      },
      {
        id: "4",
        category: "Hardscape",
        description: "Decorative Stone Mulch",
        quantity: 3,
        unit: "yard",
        unitPrice: 85,
        total: 255,
      },
      {
        id: "5",
        category: "Design",
        description: "Landscape Design and Planning",
        quantity: 1,
        unit: "each",
        unitPrice: 750,
        total: 750,
      },
    ],
    subtotal: 3470,
    markup: 867.5,
    subtotalWithMarkup: 4337.5,
    tax: 369.69,
    total: 4707.19,
    markupPercentage: 25,
    taxPercentage: 8.5,
    notes:
      "Customer prefers drought-resistant plants and modern aesthetic. Existing irrigation system will be modified to accommodate new plantings.",
    terms:
      "Payment due within 30 days of project completion. 50% deposit required to begin work. All plants come with a 1-year warranty.",
    activityLog: [
      {
        id: "1",
        date: "2025-06-16",
        time: "2:30 PM",
        action: "Estimate sent to customer",
        user: "Emma Thompson",
        details: "Sent via email with PDF attachment",
      },
      {
        id: "2",
        date: "2025-06-15",
        time: "4:15 PM",
        action: "Estimate created",
        user: "Emma Thompson",
        details: "Generated from Blue Sheet BS-001",
      },
      {
        id: "3",
        date: "2025-06-15",
        time: "11:30 AM",
        action: "Blue Sheet completed",
        user: "Emma Thompson",
        details: "Site visit and measurements completed",
      },
    ],
    attachments: [
      {
        id: "1",
        name: "UDS_Estimate_EST-2025-001.pdf",
        type: "application/pdf",
        size: "2.4 MB",
        uploadedDate: "2025-06-16",
        uploadedBy: "Emma Thompson",
        url: "/placeholder.pdf",
      },
    ],
  }

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
      case "sent-to-customer":
        return "Sent to Customer"
      case "under-negotiation":
        return "Under Negotiation"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote)
      setNewNote("")
    }
  }

  const isOverdue = estimate.daysInStage > 7 && estimate.status === "sent-to-customer"

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/estimates">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">{estimate.estimateNumber}</h1>
              {isOverdue && <AlertTriangle className="h-6 w-6 text-orange-500" />}
            </div>
            <p className="text-slate-600">
              {estimate.customerName} • {estimate.projectTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(estimate.status)} text-sm px-3 py-1 rounded-full font-medium border-0`}>
              {getStatusLabel(estimate.status)}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">{estimate.totalAmount}</div>
              <div className="text-sm text-slate-500">Total Value</div>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {isOverdue && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Follow-up Required</p>
                <p className="text-sm text-orange-700">
                  This estimate has been with the customer for {estimate.daysInStage} days without response.
                </p>
              </div>
              <Button size="sm" className="ml-auto h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 rounded-lg">
                Send Follow-up
              </Button>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto mb-6 grid grid-cols-2 lg:grid-cols-4">
            <TabsTrigger
              value="overview"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="line-items"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Line Items
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Customer Information */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{estimate.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{estimate.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{estimate.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{estimate.customerAddress}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <span className="ml-2 text-slate-900">{estimate.projectType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Estimator:</span>
                      <span className="ml-2 text-slate-900">{estimate.estimator}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Created:</span>
                      <span className="ml-2 text-slate-900">{new Date(estimate.createdDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Expires:</span>
                      <span className="ml-2 text-slate-900">{new Date(estimate.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {estimate.services.map((service) => (
                      <Badge
                        key={service}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Summary */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Pricing Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-medium text-slate-900">${estimate.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Markup ({estimate.markupPercentage}%):</span>
                      <span className="font-medium text-slate-900">${estimate.markup.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal + Markup:</span>
                      <span className="font-medium text-slate-900">${estimate.subtotalWithMarkup.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax ({estimate.taxPercentage}%):</span>
                      <span className="font-medium text-slate-900">${estimate.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-slate-900">Total:</span>
                      <span className="text-emerald-600">${estimate.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="lg:pl-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Project Notes</h4>
                        <p className="text-sm text-slate-600">{estimate.notes}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Terms & Conditions</h4>
                        <p className="text-sm text-slate-600">{estimate.terms}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="line-items" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Detailed Line Items</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="space-y-4">
                  {estimate.lineItems.map((item) => (
                    <div key={item.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0 mb-2">
                            {item.category}
                          </Badge>
                          <h4 className="font-medium text-slate-900">{item.description}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-slate-900">${item.total.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                        </div>
                        <div>
                          <span className="font-medium">Unit Price:</span> ${item.unitPrice.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> ${item.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="space-y-4">
                  {estimate.activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-slate-900">{activity.action}</h4>
                          <div className="text-xs text-slate-500">
                            {activity.date} at {activity.time}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{activity.details}</p>
                        <p className="text-xs text-slate-500">by {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Note Section */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <Label htmlFor="newNote" className="text-sm font-medium text-slate-700 mb-2 block">
                    Add Activity Note
                  </Label>
                  <Textarea
                    id="newNote"
                    placeholder="Add a note about customer communication, changes, or updates..."
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 mb-3"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    size="sm"
                    className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* File Upload */}
              <FileUpload
                label="Upload UDS Estimate"
                description="Upload the PDF estimate from UDS for reference"
                onFileUpload={(file) => {
                  console.log("File uploaded:", file.name)
                  // Handle file upload logic here
                }}
              />

              {/* Existing Documents */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Attached Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-4">
                    {estimate.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-red-600" />
                          <div>
                            <h4 className="font-medium text-slate-900">{attachment.name}</h4>
                            <p className="text-sm text-slate-500">
                              {attachment.size} • Uploaded {new Date(attachment.uploadedDate).toLocaleDateString()} by{" "}
                              {attachment.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg border-slate-200">
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Blue Sheet</h4>
                          <p className="text-sm text-slate-500">Original project documentation</p>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs rounded-lg border-slate-200"
                      >
                        <Link href={`/blue-sheets/${estimate.blueSheetId}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 mt-8">
          {estimate.status === "draft" && (
            <>
              <Button
                variant="outline"
                className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
              >
                <Edit className="mr-2 h-5 w-5" />
                Edit Estimate
              </Button>
              <Button className="flex-1 h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-lg">
                <FileText className="mr-2 h-5 w-5" />
                Send for Review
              </Button>
            </>
          )}

          {estimate.status === "internal-review" && (
            <>
              <Button
                variant="outline"
                className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
              >
                <XCircle className="mr-2 h-5 w-5" />
                Request Changes
              </Button>
              <Button className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Approve & Send
              </Button>
            </>
          )}

          {["sent-to-customer", "under-negotiation"].includes(estimate.status) && (
            <>
              <Button
                variant="outline"
                className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
              >
                <Edit className="mr-2 h-5 w-5" />
                Create Revision
              </Button>
              <Button className="flex-1 h-12 text-base font-medium bg-purple-500 hover:bg-purple-600 rounded-lg">
                <Send className="mr-2 h-5 w-5" />
                Send Follow-up
              </Button>
            </>
          )}

          {estimate.status === "approved" && (
            <Button
              asChild
              className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg"
            >
              <Link href="/scheduling">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Project
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            className="h-12 px-6 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
