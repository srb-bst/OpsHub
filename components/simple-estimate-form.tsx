"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Upload, Save, FileText, X, DollarSign } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

interface DesignProject {
  id: string
  customer_id: string
  title: string
  project_type: string
  area: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
}

interface UploadedFile {
  name: string
  size: number
  url: string
  type: string
}

export function SimpleEstimateForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const designId = searchParams.get("design")

  const [selectedDesign, setSelectedDesign] = useState<DesignProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form fields
  const [estimateTotal, setEstimateTotal] = useState("")
  const [status, setStatus] = useState("draft")
  const [notes, setNotes] = useState("")
  const [uploadedPDF, setUploadedPDF] = useState<UploadedFile | null>(null)

  useEffect(() => {
    if (designId) {
      fetchDesignData()
    } else {
      setLoading(false)
    }
  }, [designId])

  const fetchDesignData = async () => {
    try {
      const { data: designData, error } = await supabase.from("design_projects").select("*").eq("id", designId).single()

      if (error) throw error
      setSelectedDesign(designData)
    } catch (error) {
      console.error("Error fetching design data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setUploading(true)
    try {
      // For demo purposes, just store file metadata without blob URL
      setUploadedPDF({
        name: file.name,
        size: file.size,
        url: "", // No URL in demo environment
        type: file.type,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removePDF = () => {
    setUploadedPDF(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSaveEstimate = async () => {
    if (!estimateTotal || Number.parseFloat(estimateTotal) <= 0) {
      alert("Please enter a valid estimate total")
      return
    }

    if (!selectedDesign) {
      alert("Please select a design project first")
      return
    }

    setSaving(true)
    try {
      const estimateNumber = `EST-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      const total = Number.parseFloat(estimateTotal)

      // Create estimate
      const { data: estimateData, error: estimateError } = await supabase
        .from("estimates")
        .insert({
          design_project_id: selectedDesign.id,
          estimate_number: estimateNumber,
          customer_name: selectedDesign.customer_name || "Unknown Customer",
          project_title: selectedDesign.title,
          status: status,
          total_amount: total,
          subtotal: total,
          markup_percentage: 0,
          markup_amount: 0,
          tax_percentage: 0,
          tax_amount: 0,
          notes: notes,
          pdf_filename: uploadedPDF?.name || null,
          pdf_url: uploadedPDF?.url || null,
        })
        .select()
        .single()

      if (estimateError) throw estimateError

      // Update design status based on estimate status
      let newDesignStatus = "needs-estimate"
      if (status === "sent-to-customer" || status === "under-negotiation") {
        newDesignStatus = "pending-approval"
      } else if (status === "approved") {
        newDesignStatus = "approved"
      }

      const { error: updateError } = await supabase
        .from("design_projects")
        .update({ status: newDesignStatus })
        .eq("id", selectedDesign.id)

      if (updateError) throw updateError

      alert(`✅ Estimate ${estimateNumber} saved successfully!`)
      router.push("/estimates")
    } catch (error) {
      console.error("Error saving estimate:", error)
      alert("❌ Error saving estimate")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading design data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-4xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/estimates">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Create New Estimate</h1>
            <p className="text-slate-600">
              {selectedDesign ? `For ${selectedDesign.title}` : "Upload UDS estimate and set total"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Design Project Info */}
            {selectedDesign && (
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Customer:</span>
                      <span className="ml-2 text-slate-900 font-medium">
                        {selectedDesign.customer_name || "Unknown Customer"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Project:</span>
                      <span className="ml-2 text-slate-900">{selectedDesign.title}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <span className="ml-2 text-slate-900">{selectedDesign.project_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Area:</span>
                      <span className="ml-2 text-slate-900">{selectedDesign.area}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDF Upload */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">UDS Estimate PDF</CardTitle>
                <p className="text-sm text-slate-600">Upload the estimate PDF generated from UDS</p>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                {!uploadedPDF ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="mt-4">
                        <Label htmlFor="pdf-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-slate-900">Click to upload PDF</span>
                          <span className="mt-1 block text-sm text-slate-500">PDF files up to 10MB</span>
                        </Label>
                        <Input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handlePDFUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </div>
                      {uploading && (
                        <div className="mt-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
                          <p className="text-sm text-slate-500 mt-2">Uploading...</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{uploadedPDF.name}</p>
                        <p className="text-sm text-slate-500">{formatFileSize(uploadedPDF.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removePDF}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estimate Details */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Estimate Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimateTotal" className="text-sm font-medium text-slate-700">
                      Total Amount *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="estimateTotal"
                        type="number"
                        step="0.01"
                        value={estimateTotal}
                        onChange={(e) => setEstimateTotal(e.target.value)}
                        placeholder="0.00"
                        className="h-12 pl-10 text-base rounded-lg border-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-slate-700">
                      Status
                    </Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="internal-review">Internal Review</SelectItem>
                        <SelectItem value="sent-to-customer">Sent to Customer</SelectItem>
                        <SelectItem value="under-negotiation">Under Negotiation</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes about this estimate..."
                    rows={3}
                    className="text-base rounded-lg border-slate-200"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">PDF Uploaded:</span>
                  <span className={uploadedPDF ? "text-green-600" : "text-slate-400"}>
                    {uploadedPDF ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="font-medium text-slate-900">
                    {estimateTotal ? `$${Number.parseFloat(estimateTotal).toFixed(2)}` : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status:</span>
                  <span className="font-medium text-slate-900 capitalize">{status.replace("-", " ")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
                <Button
                  onClick={handleSaveEstimate}
                  disabled={!selectedDesign || !estimateTotal || saving}
                  className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {saving ? "Saving..." : "Save Estimate"}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 text-base font-medium rounded-lg border-slate-200"
                >
                  <Link href="/estimates">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
