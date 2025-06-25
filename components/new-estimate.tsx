"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Calculator, Save } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
  customer_id: string
  title: string
  project_type: string
  area: string
  customer?: {
    id: string
    first_name: string
    last_name: string
    email?: string
    phone?: string
    address?: string
  }
}

export function NewEstimate() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const designId = searchParams.get("design")

  // FORCE DEBUG - Remove after testing
  console.log("=== ESTIMATE FORM DEBUG ===")
  console.log("Current URL:", window.location.href)
  console.log("Search params string:", searchParams.toString())
  console.log("Design ID extracted:", designId)
  console.log("Design ID type:", typeof designId)
  console.log("Design ID length:", designId?.length)
  console.log("===============================")

  // Debug logging
  console.log("URL Search Params:", searchParams.toString())
  console.log("Design ID from URL:", designId)

  const [selectedDesign, setSelectedDesign] = useState<DesignProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [markupPercentage, setMarkupPercentage] = useState(25)
  const [taxPercentage, setTaxPercentage] = useState(8.5)
  const [notes, setNotes] = useState("")
  const [terms, setTerms] = useState("Payment due within 30 days of project completion.")

  useEffect(() => {
    // FORCE BLANK STATE - Remove after testing
    console.log("useEffect: Forcing blank state regardless of URL")
    setSelectedDesign(null)
    setLineItems([])
    setLoading(false)
    return // Exit early to force blank
  }, [designId])

  const fetchDesignData = async () => {
    try {
      // Fetch design project
      const { data: designData, error: designError } = await supabase
        .from("design_projects")
        .select("*")
        .eq("id", designId)
        .single()

      if (designError) throw designError

      // Fetch customer data
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", designData.customer_id)
        .single()

      if (customerError) throw customerError

      setSelectedDesign({
        ...designData,
        customer: customerData,
      })
    } catch (error) {
      console.error("Error fetching design data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      category: "Plants & Materials",
      description: "",
      quantity: 1,
      unit: "each",
      unitPrice: 0,
      total: 0,
    }
    setLineItems([...lineItems, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const calculateTotals = () => {
    if (lineItems.length === 0) {
      return {
        subtotal: 0,
        markup: 0,
        subtotalWithMarkup: 0,
        tax: 0,
        total: 0,
      }
    }

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
    const markup = subtotal * (markupPercentage / 100)
    const subtotalWithMarkup = subtotal + markup
    const tax = subtotalWithMarkup * (taxPercentage / 100)
    const total = subtotalWithMarkup + tax

    return {
      subtotal,
      markup,
      subtotalWithMarkup,
      tax,
      total,
    }
  }

  const totals = calculateTotals()

  const handleSaveEstimate = async () => {
    if (lineItems.length === 0) {
      alert("Please add at least one line item to create an estimate.")
      return
    }

    if (!selectedDesign) {
      alert(
        "This feature requires selecting a design project first. Please create estimates from the Design Projects page.",
      )
      return
    }

    try {
      const estimateNumber = `EST-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      const customerName = selectedDesign.customer
        ? `${selectedDesign.customer.first_name} ${selectedDesign.customer.last_name}`
        : "Unknown Customer"

      // Create estimate
      const { data: estimateData, error: estimateError } = await supabase
        .from("estimates")
        .insert({
          design_project_id: selectedDesign.id,
          estimate_number: estimateNumber,
          customer_name: customerName,
          project_title: selectedDesign.title,
          status: "draft",
          total_amount: totals.total,
          subtotal: totals.subtotal,
          markup_percentage: markupPercentage,
          markup_amount: totals.markup,
          tax_percentage: taxPercentage,
          tax_amount: totals.tax,
          notes: notes,
          terms: terms,
        })
        .select()
        .single()

      if (estimateError) throw estimateError

      // Create line items
      const lineItemsToInsert = lineItems.map((item) => ({
        estimate_id: estimateData.id,
        category: item.category,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unitPrice,
        total: item.total,
      }))

      const { error: lineItemsError } = await supabase.from("estimate_line_items").insert(lineItemsToInsert)

      if (lineItemsError) throw lineItemsError

      // Update design status
      const { error: updateError } = await supabase
        .from("design_projects")
        .update({ status: "pending-approval" })
        .eq("id", selectedDesign.id)

      if (updateError) throw updateError

      alert(`✅ Estimate ${estimateNumber} created successfully!`)
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
      <div className="max-w-5xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/designs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Create New Estimate</h1>
            <p className="text-slate-600">
              {selectedDesign ? `For ${selectedDesign.title}` : "Build a custom estimate from scratch"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Design Project Info */}
            {!selectedDesign ? (
              <Card className="bg-blue-50/80 backdrop-blur-sm rounded-xl border-blue-200/60 shadow-none">
                <CardContent className="p-4 lg:p-6">
                  <div className="text-center">
                    <p className="text-blue-700 font-medium mb-2">No Design Project Selected</p>
                    <p className="text-blue-600 text-sm">
                      To create estimates linked to projects, start from the Design Projects page and click "Create
                      Estimate" on a specific project.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 lg:p-6 pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Customer:</span>
                      <span className="ml-2 text-slate-900 font-medium">
                        {selectedDesign.customer
                          ? `${selectedDesign.customer.first_name} ${selectedDesign.customer.last_name}`
                          : "Unknown Customer"}
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
                  {selectedDesign.customer?.address && (
                    <div className="mt-3 text-sm">
                      <span className="text-slate-500">Address:</span>
                      <span className="ml-2 text-slate-900">{selectedDesign.customer.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Line Items */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">Line Items</CardTitle>
                  <Button
                    onClick={addLineItem}
                    size="sm"
                    className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                {lineItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">No line items added yet</p>
                    <Button onClick={addLineItem} size="sm" className="bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lineItems.map((item, index) => (
                      <div key={item.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`category-${item.id}`} className="text-sm font-medium text-slate-700">
                                Category
                              </Label>
                              <Select
                                value={item.category}
                                onValueChange={(value) => updateLineItem(item.id, "category", value)}
                              >
                                <SelectTrigger className="h-10 text-sm rounded-lg border-slate-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Plants & Materials">Plants & Materials</SelectItem>
                                  <SelectItem value="Labor">Labor</SelectItem>
                                  <SelectItem value="Hardscape">Hardscape</SelectItem>
                                  <SelectItem value="Equipment">Equipment</SelectItem>
                                  <SelectItem value="Design">Design</SelectItem>
                                  <SelectItem value="Consultation">Consultation</SelectItem>
                                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end">
                              <Button
                                onClick={() => removeLineItem(item.id)}
                                size="sm"
                                variant="outline"
                                className="h-10 w-10 p-0 rounded-lg border-slate-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`description-${item.id}`} className="text-sm font-medium text-slate-700">
                              Description
                            </Label>
                            <Input
                              id={`description-${item.id}`}
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                              placeholder="Detailed description of work or materials"
                              className="h-10 text-sm rounded-lg border-slate-200"
                            />
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <Label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-slate-700">
                                Quantity
                              </Label>
                              <Input
                                id={`quantity-${item.id}`}
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateLineItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)
                                }
                                className="h-10 text-sm rounded-lg border-slate-200"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`unit-${item.id}`} className="text-sm font-medium text-slate-700">
                                Unit
                              </Label>
                              <Select
                                value={item.unit}
                                onValueChange={(value) => updateLineItem(item.id, "unit", value)}
                              >
                                <SelectTrigger className="h-10 text-sm rounded-lg border-slate-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="each">Each</SelectItem>
                                  <SelectItem value="sq ft">Sq Ft</SelectItem>
                                  <SelectItem value="linear ft">Linear Ft</SelectItem>
                                  <SelectItem value="hour">Hour</SelectItem>
                                  <SelectItem value="day">Day</SelectItem>
                                  <SelectItem value="yard">Yard</SelectItem>
                                  <SelectItem value="ton">Ton</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor={`unitPrice-${item.id}`} className="text-sm font-medium text-slate-700">
                                Unit Price
                              </Label>
                              <Input
                                id={`unitPrice-${item.id}`}
                                type="number"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)
                                }
                                className="h-10 text-sm rounded-lg border-slate-200"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-slate-700">Total</Label>
                              <div className="h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-sm font-medium text-slate-900">
                                ${item.total.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes and Terms */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                    Project Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional project details, special requirements, or clarifications..."
                    rows={3}
                    className="text-sm rounded-lg border-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="terms" className="text-sm font-medium text-slate-700">
                    Terms & Conditions
                  </Label>
                  <Textarea
                    id="terms"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Payment terms, warranty information, project timeline..."
                    rows={3}
                    className="text-sm rounded-lg border-slate-200"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Pricing Summary */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Pricing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium text-slate-900">${totals.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="markup" className="text-sm text-slate-600">
                        Markup:
                      </Label>
                      <Input
                        id="markup"
                        type="number"
                        value={markupPercentage}
                        onChange={(e) => setMarkupPercentage(Number.parseFloat(e.target.value) || 0)}
                        className="h-8 w-16 text-xs rounded border-slate-200"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Markup Amount:</span>
                      <span className="font-medium text-slate-900">${totals.markup.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal + Markup:</span>
                    <span className="font-medium text-slate-900">${totals.subtotalWithMarkup.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="tax" className="text-sm text-slate-600">
                        Tax:
                      </Label>
                      <Input
                        id="tax"
                        type="number"
                        step="0.1"
                        value={taxPercentage}
                        onChange={(e) => setTaxPercentage(Number.parseFloat(e.target.value) || 0)}
                        className="h-8 w-16 text-xs rounded border-slate-200"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax Amount:</span>
                      <span className="font-medium text-slate-900">${totals.tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-slate-900">Total:</span>
                    <span className="text-emerald-600">${totals.total.toFixed(2)}</span>
                  </div>
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
                  disabled={!selectedDesign || saving}
                  className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {saving ? "Saving..." : "Save Estimate"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
