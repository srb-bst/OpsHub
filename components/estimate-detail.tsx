"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit,
  Send,
  Download,
  MessageSquare,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/file-upload"
import { supabase } from "@/lib/supabase"

interface EstimateDetailProps {
  estimateId: string
}

export function EstimateDetail({ estimateId }: EstimateDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [newNote, setNewNote] = useState("")
  const [estimate, setEstimate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    fetchEstimate()
  }, [estimateId])

  const fetchEstimate = async () => {
    try {
      console.log("🔄 Starting fetch for estimate ID:", estimateId)
      console.log("🔄 ID type:", typeof estimateId)
      console.log("🔄 ID length:", estimateId.length)

      // First, let's see what estimates exist
      const { data: allEstimates, error: allError } = await supabase
        .from("estimates")
        .select("id, estimate_number, customer_name, total_amount")
        .limit(10)

      console.log("📋 All available estimates:", allEstimates)
      setDebugInfo({ allEstimates, searchingFor: estimateId })

      if (allError) {
        console.error("❌ Error fetching all estimates:", allError)
        setError("Database connection error")
        return
      }

      // Try to find the estimate with exact ID match
      const { data: exactMatch, error: exactError } = await supabase
        .from("estimates")
        .select("*")
        .eq("id", estimateId)
        .single()

      console.log("🔍 Exact match result:", exactMatch)
      console.log("🔍 Exact match error:", exactError)

      if (exactError || !exactMatch) {
        // Try to find by estimate number if ID doesn't work
        const { data: byNumber, error: numberError } = await supabase
          .from("estimates")
          .select("*")
          .eq("estimate_number", estimateId)
          .single()

        console.log("🔍 By number result:", byNumber)

        if (numberError || !byNumber) {
          setError(`Estimate not found. Available IDs: ${allEstimates?.map((e) => e.id).join(", ")}`)
          return
        } else {
          setEstimate(byNumber)
          console.log("✅ Found estimate by number:", byNumber)
          return
        }
      }

      // If we found the estimate, get related design project
      let designProject = null
      if (exactMatch.design_project_id) {
        console.log("🔄 Fetching design project:", exactMatch.design_project_id)

        const { data: dpData, error: dpError } = await supabase
          .from("design_projects")
          .select("*")
          .eq("id", exactMatch.design_project_id)
          .single()

        if (dpError) {
          console.error("⚠️ Error fetching design project:", dpError)
        } else {
          designProject = dpData
          console.log("✅ Design project found:", designProject)
        }
      }

      const combinedData = {
        ...exactMatch,
        design_project: designProject,
      }

      console.log("✅ Final estimate data:", combinedData)
      setEstimate(combinedData)
    } catch (err) {
      console.error("❌ Unexpected error:", err)
      setError("Unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleViewFile = async (filename: string, url?: string) => {
    console.log("🔄 Attempting to view file:", filename, url)

    if (url && url !== "/placeholder.pdf") {
      // If we have a real URL, open it
      window.open(url, "_blank")
    } else {
      // Try to get the file from Supabase storage
      try {
        const { data, error } = await supabase.storage.from("estimates").createSignedUrl(filename, 3600) // 1 hour expiry

        if (error) {
          console.error("❌ Error creating signed URL:", error)
          alert("Unable to view file. File may not exist in storage.")
        } else {
          console.log("✅ Created signed URL:", data.signedUrl)
          window.open(data.signedUrl, "_blank")
        }
      } catch (err) {
        console.error("❌ Error accessing file:", err)
        alert("Unable to access file. Please check if the file exists.")
      }
    }
  }

  const handleDownloadFile = async (filename: string, url?: string) => {
    console.log("🔄 Attempting to download file:", filename, url)

    if (url && url !== "/placeholder.pdf") {
      // If we have a real URL, download it
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Try to download from Supabase storage
      try {
        const { data, error } = await supabase.storage.from("estimates").download(filename)

        if (error) {
          console.error("❌ Error downloading file:", error)
          alert("Unable to download file. File may not exist in storage.")
        } else {
          console.log("✅ Downloaded file data:", data)
          const url = URL.createObjectURL(data)
          const link = document.createElement("a")
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      } catch (err) {
        console.error("❌ Error downloading file:", err)
        alert("Unable to download file. Please check if the file exists.")
      }
    }
  }

  const handleGoBack = () => {
    // Use router.back() to go to the previous page in history
    router.back()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading estimate...</p>
          <p className="text-xs text-slate-400 mt-2">Searching for ID: {estimateId}</p>
          {debugInfo && (
            <div className="mt-4 text-xs text-slate-400">
              <p>Available estimates: {debugInfo.allEstimates?.length || 0}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (error || !estimate) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center max-w-2xl p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Estimate Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="bg-slate-50 p-4 rounded-lg mb-4">
            <p className="text-xs text-slate-600 mb-2">Debug Info:</p>
            <p className="text-xs text-slate-400">Searching for: {estimateId}</p>
            {debugInfo?.allEstimates && (
              <div className="mt-2">
                <p className="text-xs text-slate-400">Available estimates:</p>
                <ul className="text-xs text-slate-400 mt-1">
                  {debugInfo.allEstimates.map((est: any) => (
                    <li key={est.id}>
                      ID: {est.id} | Number: {est.estimate_number} | Customer: {est.customer_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button onClick={handleGoBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Transform the real data
  const transformedEstimate = {
    id: estimate.id,
    estimateNumber: estimate.estimate_number || `EST-${estimate.id.slice(0, 8)}`,
    customerName: estimate.customer_name || estimate.design_project?.customer_name || "Unknown Customer",
    projectTitle: estimate.project_title || estimate.design_project?.title || "Untitled Project",
    blueSheetId: estimate.design_project_id,
    status: estimate.status || "draft",
    totalAmount: `$${(estimate.total_amount || 0).toLocaleString()}`,
    createdDate: new Date(estimate.created_at).toISOString().split("T")[0],
    sentDate: estimate.sent_at ? new Date(estimate.sent_at).toISOString().split("T")[0] : null,
    expiryDate: estimate.expires_at ? new Date(estimate.expires_at).toISOString().split("T")[0] : null,
    estimator: "System User",
    estimatorInitials: "SU",
    priority: "medium",
    customerEmail: estimate.design_project?.customer_email || "",
    customerPhone: estimate.design_project?.customer_phone || "",
    customerAddress: estimate.design_project?.customer_address || "",
    projectType: estimate.design_project?.project_type || "Residential",
    services: ["Design", "Installation"],
    revisionCount: 0,
    lastActivity: "Created",
    daysInStage: Math.floor((new Date().getTime() - new Date(estimate.created_at).getTime()) / (1000 * 60 * 60 * 24)),
    lineItems: [],
    subtotal: estimate.subtotal || 0,
    markup: estimate.markup_amount || 0,
    subtotalWithMarkup: (estimate.subtotal || 0) + (estimate.markup_amount || 0),
    tax: estimate.tax_amount || 0,
    total: estimate.total_amount || 0,
    markupPercentage: estimate.markup_percentage || 0,
    taxPercentage: estimate.tax_percentage || 0,
    notes: estimate.notes || "",
    terms: estimate.terms || "Payment due within 30 days of project completion.",
    activityLog: [
      {
        id: "1",
        date: new Date(estimate.created_at).toISOString().split("T")[0],
        time: new Date(estimate.created_at).toLocaleTimeString(),
        action: "Estimate created",
        user: "System User",
        details: "Estimate created in system",
      },
    ],
    attachments: estimate.pdf_filename
      ? [
          {
            id: "1",
            name: estimate.pdf_filename,
            type: "application/pdf",
            size: "Unknown",
            uploadedDate: new Date(estimate.created_at).toISOString().split("T")[0],
            uploadedBy: "System User",
            url: estimate.pdf_url || null,
          },
        ]
      : [],
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

  const isOverdue = transformedEstimate.daysInStage > 7 && transformedEstimate.status === "sent-to-customer"

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
        {/* Debug Info Banner */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Debug:</strong> Loaded estimate ID: {estimate.id} | Customer: {estimate.customer_name} | Total: $
            {estimate.total_amount} | Created: {new Date(estimate.created_at).toLocaleDateString()}
            {estimate.pdf_filename && ` | PDF: ${estimate.pdf_filename}`}
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-lg hover:bg-white/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">
                {transformedEstimate.estimateNumber}
              </h1>
              {isOverdue && <AlertTriangle className="h-6 w-6 text-orange-500" />}
            </div>
            <p className="text-slate-600">
              {transformedEstimate.customerName} • {transformedEstimate.projectTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(transformedEstimate.status)} text-sm px-3 py-1 rounded-full font-medium border-0`}
            >
              {getStatusLabel(transformedEstimate.status)}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">{transformedEstimate.totalAmount}</div>
              <div className="text-sm text-slate-500">Total Value</div>
            </div>
          </div>
        </div>

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
                    <span className="text-slate-900">{transformedEstimate.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{transformedEstimate.customerPhone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{transformedEstimate.customerEmail || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-900">{transformedEstimate.customerAddress || "Not provided"}</span>
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
                      <span className="ml-2 text-slate-900">{transformedEstimate.projectType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Estimator:</span>
                      <span className="ml-2 text-slate-900">{transformedEstimate.estimator}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Created:</span>
                      <span className="ml-2 text-slate-900">
                        {new Date(transformedEstimate.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Expires:</span>
                      <span className="ml-2 text-slate-900">
                        {transformedEstimate.expiryDate
                          ? new Date(transformedEstimate.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {transformedEstimate.services.map((service) => (
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
                      <span className="font-medium text-slate-900">${transformedEstimate.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Markup ({transformedEstimate.markupPercentage}%):</span>
                      <span className="font-medium text-slate-900">${transformedEstimate.markup.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal + Markup:</span>
                      <span className="font-medium text-slate-900">
                        ${transformedEstimate.subtotalWithMarkup.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax ({transformedEstimate.taxPercentage}%):</span>
                      <span className="font-medium text-slate-900">${transformedEstimate.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-slate-900">Total:</span>
                      <span className="text-emerald-600">${transformedEstimate.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="lg:pl-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Project Notes</h4>
                        <p className="text-sm text-slate-600">{transformedEstimate.notes || "No notes provided"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Terms & Conditions</h4>
                        <p className="text-sm text-slate-600">{transformedEstimate.terms}</p>
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
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Line items will be available in a future update</p>
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
                  {transformedEstimate.activityLog.map((activity) => (
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
                }}
              />

              {/* Existing Documents */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Attached Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="space-y-4">
                    {transformedEstimate.attachments.length > 0 ? (
                      transformedEstimate.attachments.map((attachment) => (
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs rounded-lg border-slate-200"
                              onClick={() => handleViewFile(attachment.name, attachment.url)}
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs rounded-lg border-slate-200"
                              onClick={() => handleDownloadFile(attachment.name, attachment.url)}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No documents attached</p>
                      </div>
                    )}

                    {transformedEstimate.blueSheetId && (
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-slate-900">Design Project</h4>
                            <p className="text-sm text-slate-500">Original project documentation</p>
                          </div>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs rounded-lg border-slate-200"
                        >
                          <Link href={`/designs/${transformedEstimate.blueSheetId}`}>View</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 mt-8">
          <Button
            variant="outline"
            className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
          >
            <Edit className="mr-2 h-5 w-5" />
            Edit Estimate
          </Button>
          <Button className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg">
            <Send className="mr-2 h-5 w-5" />
            Send to Customer
          </Button>
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
