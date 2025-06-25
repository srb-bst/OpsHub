"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { Upload, FileText, X } from "lucide-react"

interface SimpleEstimateFormProps {
  designProjectId?: string
  customerName?: string
  projectTitle?: string
}

export function SimpleEstimateForm({ designProjectId, customerName, projectTitle }: SimpleEstimateFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const designId = searchParams.get("design")
  const [designProject, setDesignProject] = useState<any>(null)
  const [loadingDesign, setLoadingDesign] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    customerName: customerName || "",
    projectTitle: projectTitle || "",
    totalAmount: "",
    notes: "",
    status: "draft" as const,
  })

  useEffect(() => {
    if (designId) {
      fetchDesignProject(designId)
    }
  }, [designId])

  const fetchDesignProject = async (id: string) => {
    setLoadingDesign(true)
    try {
      const { data, error } = await supabase.from("design_projects").select("*").eq("id", id).single()

      if (error) throw error

      if (data) {
        setDesignProject(data)
        // Populate customer information from design project
        setFormData((prev) => ({
          ...prev,
          customerName: data.customer_name || "",
          projectTitle: data.title || "",
        }))
      }
    } catch (error) {
      console.error("Error fetching design project:", error)
    } finally {
      setLoadingDesign(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("📁 File selected:", file.name, file.type, file.size)
      if (file.type === "application/pdf") {
        setUploadedFile(file)
      } else {
        alert("Please upload a PDF file only")
        event.target.value = ""
      }
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
  }

  const uploadFileToStorage = async (file: File): Promise<{ filename: string; url: string } | null> => {
    try {
      console.log("🔄 Starting file upload to Supabase storage...")
      console.log("📁 File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      // Create a unique filename
      const timestamp = Date.now()
      const filename = `estimate_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

      console.log("📁 Uploading as:", filename)

      // Upload to Supabase storage
      const { data, error } = await supabase.storage.from("estimates").upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("❌ Storage upload error:", error)
        console.error("❌ Error details:", {
          message: error.message,
          statusCode: error.statusCode,
          error: error.error,
        })

        // Provide specific error messages
        if (error.message?.includes("Bucket not found")) {
          throw new Error("Storage bucket not found. Please contact support.")
        } else if (error.message?.includes("File size")) {
          throw new Error("File is too large. Maximum size is 10MB.")
        } else if (error.message?.includes("mime type")) {
          throw new Error("Invalid file type. Only PDF files are allowed.")
        } else {
          throw new Error(`Upload failed: ${error.message}`)
        }
      }

      console.log("✅ File uploaded successfully:", data)

      // Get the public URL
      const { data: urlData } = supabase.storage.from("estimates").getPublicUrl(filename)

      console.log("🔗 Public URL:", urlData.publicUrl)

      return {
        filename: filename,
        url: urlData.publicUrl,
      }
    } catch (error) {
      console.error("❌ File upload failed:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("🔄 Starting estimate creation...")
      console.log("📋 Form data:", formData)
      console.log("📁 File to upload:", uploadedFile?.name)

      let fileData = null

      // Upload file if one was selected
      if (uploadedFile) {
        console.log("🔄 Uploading file first...")
        setUploadProgress(25)

        try {
          fileData = await uploadFileToStorage(uploadedFile)

          if (!fileData) {
            alert("Failed to upload file. Please check the console for details and try again.")
            setLoading(false)
            return
          }
        } catch (error) {
          alert(`File upload failed: ${error.message}`)
          setLoading(false)
          return
        }

        setUploadProgress(50)
        console.log("✅ File uploaded:", fileData)
      }

      setUploadProgress(75)

      // Create the estimate record
      const estimateData = {
        design_project_id: designId || designProjectId || null,
        estimate_number: `EST-${Date.now()}`,
        customer_name: formData.customerName,
        project_title: formData.projectTitle,
        status: formData.status,
        total_amount: Number.parseFloat(formData.totalAmount),
        notes: formData.notes,
        pdf_filename: fileData?.filename || null,
        pdf_url: fileData?.url || null,
        created_at: new Date().toISOString(),
      }

      console.log("💾 Saving estimate:", estimateData)

      const { data, error } = await supabase.from("estimates").insert([estimateData]).select().single()

      if (error) {
        console.error("❌ Database error:", error)
        throw error
      }

      console.log("✅ Estimate saved:", data)
      setUploadProgress(100)

      // Update design project status if applicable
      if (designProjectId) {
        console.log("🔄 Updating design project status...")
        const { error: updateError } = await supabase
          .from("design_projects")
          .update({ status: "estimate_created" })
          .eq("id", designProjectId)

        if (updateError) {
          console.error("⚠️ Failed to update design project status:", updateError)
        } else {
          console.log("✅ Design project status updated")
        }
      }

      alert("Estimate saved successfully!")
      router.push(`/estimates/${data.id}`)
    } catch (error) {
      console.error("❌ Error saving estimate:", error)
      alert("Failed to save estimate. Please try again.")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const amounts = null

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900">Create Estimate</CardTitle>
          <p className="text-sm text-slate-600">Upload UDS estimate and set total amount</p>
          {designProject && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>From Design Project: {designProject.title}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer & Project Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="customerName" className="text-sm font-medium text-slate-700">
                  Customer Name
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="mt-1 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectTitle" className="text-sm font-medium text-slate-700">
                  Project Title
                </Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="mt-1 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">UDS Estimate PDF</Label>
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PDF files only, max 10MB</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-900">{uploadedFile.name}</p>
                      <p className="text-xs text-emerald-700">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div>
              <Label htmlFor="totalAmount" className="text-sm font-medium text-slate-700">
                Total Amount ($)
              </Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className="mt-1 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger className="mt-1 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="internal-review">Internal Review</SelectItem>
                    <SelectItem value="sent-to-customer">Sent to Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                Notes
              </Label>
              <Textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Additional notes about the estimate..."
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-12 rounded-lg border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.customerName || !formData.projectTitle || !formData.totalAmount}
                className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
              >
                {loading ? "Saving..." : "Save Estimate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
