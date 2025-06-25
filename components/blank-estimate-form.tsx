"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, FileText, Upload, X, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface LineItem {
  id: string
  category: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

interface DesignProject {
  id: string
  title: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  customer_city?: string
  customer_state?: string
  customer_zip?: string
  project_type: string
  area: string
  description?: string
}

interface UploadedFile {
  name: string
  size: number
  url: string
  type: string
}

export function BlankEstimateForm() {
  const searchParams = useSearchParams()
  const designId = searchParams.get("design")

  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [designProject, setDesignProject] = useState<DesignProject | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadedPDF, setUploadedPDF] = useState<UploadedFile | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (designId) {
      fetchDesignProject(designId)
    }
  }, [designId])

  const fetchDesignProject = async (id: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("design_projects").select("*").eq("id", id).single()

      if (error) throw error

      if (data) {
        setDesignProject(data)
        // Populate customer information from design project
        setCustomerName(data.customer_name || "")
        setCustomerEmail(data.customer_email || "")
        setCustomerPhone(data.customer_phone || "")
        setCustomerAddress(
          [data.customer_address, data.customer_city, data.customer_state, data.customer_zip]
            .filter(Boolean)
            .join(", "),
        )
        setProjectTitle(data.title || "")
        setNotes(`Project Type: ${data.project_type}\nArea: ${data.area}\n\n${data.description || ""}`)
      }
    } catch (error) {
      console.error("Error fetching design project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setUploading(true)
    try {
      // Create a URL for the uploaded file (in a real app, you'd upload to Supabase Storage)
      const url = URL.createObjectURL(file)

      setUploadedPDF({
        name: file.name,
        size: file.size,
        url: url,
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
    if (uploadedPDF?.url) {
      URL.revokeObjectURL(uploadedPDF.url)
    }
    setUploadedPDF(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      category: "",
      description: "",
      quantity: 1,
      unit: "each",
      unitPrice: 0,
      total: 0,
    }
    setLineItems([...lineItems, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice
          }
          return updated
        }
        return item
      }),
    )
  }

  const removeLineItem = (id: string) => {
    setLineItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading design project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Estimate</h1>
          {designProject && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>From Design Project: {designProject.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="projectTitle">Project Title</Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter project title"
            />
          </div>
        </CardContent>
      </Card>

      {/* PDF Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Estimate (Optional)</CardTitle>
          <p className="text-sm text-muted-foreground">Upload a PDF of an existing estimate for reference</p>
        </CardHeader>
        <CardContent>
          {!uploadedPDF ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="pdf-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">Click to upload PDF</span>
                    <span className="mt-1 block text-sm text-gray-500">PDF files up to 10MB</span>
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
                    <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{uploadedPDF.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(uploadedPDF.size)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => window.open(uploadedPDF.url, "_blank")}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={removePDF} className="text-red-600 hover:text-red-700">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Estimate Items</CardTitle>
          <Button onClick={addLineItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          {lineItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items added yet</p>
              <p className="text-sm">Click "Add Item" to start building your estimate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                  <div className="col-span-2">
                    <Label>Category</Label>
                    <Select value={item.category} onValueChange={(value) => updateLineItem(item.id, "category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plants">Plants</SelectItem>
                        <SelectItem value="materials">Materials</SelectItem>
                        <SelectItem value="labor">Labor</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label>Unit</Label>
                    <Select value={item.unit} onValueChange={(value) => updateLineItem(item.id, "unit", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="each">Each</SelectItem>
                        <SelectItem value="sq ft">Sq Ft</SelectItem>
                        <SelectItem value="linear ft">Linear Ft</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <div className="h-10 flex items-center font-medium">${item.total.toFixed(2)}</div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or terms..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button size="lg" className="flex-1">
          Save Estimate
        </Button>
        <Button variant="outline" size="lg">
          Save as Draft
        </Button>
      </div>
    </div>
  )
}
