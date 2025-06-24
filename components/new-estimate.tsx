"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, Calculator, FileText, Save, Send } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface LineItem {
  id: string
  category: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

interface BlueSheet {
  id: string
  customerName: string
  projectTitle: string
  address: string
  phone: string
  email: string
  services: string[]
  projectType: string
}

const mockBlueSheets: BlueSheet[] = [
  {
    id: "bs-001",
    customerName: "Sarah Johnson",
    projectTitle: "Front Yard Redesign",
    address: "123 Oak Street, Springfield",
    phone: "(555) 123-4567",
    email: "sarah.johnson@email.com",
    services: ["Design", "Installation"],
    projectType: "Residential",
  },
  {
    id: "bs-002",
    customerName: "Jennifer Martinez",
    projectTitle: "Backyard Renovation",
    address: "789 Pine Road, Springfield",
    phone: "(555) 345-6789",
    email: "jennifer.martinez@email.com",
    services: ["Design", "Hardscape", "Installation"],
    projectType: "Residential",
  },
  {
    id: "bs-004",
    customerName: "Robert Thompson",
    projectTitle: "Garden Design Consultation",
    address: "456 Maple Street, Springfield",
    phone: "(555) 234-5678",
    email: "robert.thompson@email.com",
    services: ["Design", "Consultation"],
    projectType: "Residential",
  },
]

export function NewEstimate() {
  const [selectedBlueSheet, setSelectedBlueSheet] = useState<string>("")
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      category: "Plants & Materials",
      description: "Japanese Maple Trees (6-8 ft)",
      quantity: 2,
      unit: "each",
      unitPrice: 450,
      total: 900,
    },
  ])
  const [markupPercentage, setMarkupPercentage] = useState(25)
  const [taxPercentage, setTaxPercentage] = useState(8.5)
  const [notes, setNotes] = useState("")
  const [terms, setTerms] = useState("Payment due within 30 days of project completion.")

  const selectedBlueSheetData = mockBlueSheets.find((bs) => bs.id === selectedBlueSheet)

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

  const handleSaveDraft = () => {
    console.log("Saving draft estimate...")
    // Save logic here
  }

  const handleSendForReview = () => {
    console.log("Sending for internal review...")
    // Send for review logic here
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-5xl mx-auto pt-16 lg:pt-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/estimates">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Create New Estimate</h1>
            <p className="text-slate-600">Generate a detailed estimate from a Blue Sheet</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blue Sheet Selection */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
              <CardHeader className="p-4 lg:p-6 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Select Blue Sheet</CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <Select value={selectedBlueSheet} onValueChange={setSelectedBlueSheet}>
                  <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
                    <SelectValue placeholder="Choose a Blue Sheet to create estimate from" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBlueSheets.map((blueSheet) => (
                      <SelectItem key={blueSheet.id} value={blueSheet.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{blueSheet.customerName}</span>
                          <span className="text-sm text-slate-500">{blueSheet.projectTitle}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedBlueSheetData && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Customer:</span>
                        <span className="ml-2 text-slate-900 font-medium">{selectedBlueSheetData.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Project:</span>
                        <span className="ml-2 text-slate-900">{selectedBlueSheetData.projectTitle}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Type:</span>
                        <span className="ml-2 text-slate-900">{selectedBlueSheetData.projectType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Services:</span>
                        <div className="ml-2 flex flex-wrap gap-1 mt-1">
                          {selectedBlueSheetData.services.map((service) => (
                            <Badge
                              key={service}
                              className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
                            <Select value={item.unit} onValueChange={(value) => updateLineItem(item.id, "unit", value)}>
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
                  onClick={handleSaveDraft}
                  variant="outline"
                  className="w-full h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSendForReview}
                  className="w-full h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Send for Review
                </Button>
                <Button
                  disabled={!selectedBlueSheet || lineItems.length === 0}
                  className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send to Customer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
