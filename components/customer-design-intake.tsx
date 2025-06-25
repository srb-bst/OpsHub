"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Save, Camera, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@supabase/supabase-js"
import { createDesignProject } from "../app/designs/new/actions"

// Create a fresh Supabase client to bypass cache
const freshSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  db: { schema: "public" },
  auth: { autoRefreshToken: false, persistSession: false },
})

export function CustomerDesignIntake() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("customer-info")

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    customerCity: "",
    customerState: "",
    customerZip: "",
    title: "",
    projectType: "residential",
    area: "front-yard",
    description: "",
    budgetRange: "",
    timeline: "",
    designStyle: "modern",
    maintenanceLevel: "low",
    plantPreferences: "",
    staffNotes: "",
    initialDesignNotes: "",
    recommendedPlants: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value)
    })

    try {
      const result = await createDesignProject(form)

      if (result.success) {
        alert("✅ Design project created successfully!")
        router.push("/designs")
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      alert("❌ Error creating design project")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-12 bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
              <Link href="/designs">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">New Project</h1>
              <p className="text-xl text-gray-600">Create a new landscaping design project for a customer</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-20 mb-12 bg-white rounded-3xl shadow-sm border-0 p-3">
            <TabsTrigger
              value="customer-info"
              className="text-lg font-semibold py-6 rounded-2xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Customer Information
            </TabsTrigger>
            <TabsTrigger
              value="project-details"
              className="text-lg font-semibold py-6 rounded-2xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Project Details
            </TabsTrigger>
            <TabsTrigger
              value="design-overview"
              className="text-lg font-semibold py-6 rounded-2xl data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Design Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer-info" className="space-y-10">
            <Card className="bg-white rounded-3xl shadow-sm border-0 p-12">
              <div className="grid gap-12 lg:grid-cols-2">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="customerName" className="text-lg font-semibold text-gray-900">
                      Customer Name *
                    </Label>
                    <Input
                      id="customerName"
                      required
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      placeholder="First and last name"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="customerPhone" className="text-lg font-semibold text-gray-900">
                      Phone Number
                    </Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      placeholder="Phone number"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="customerEmail" className="text-lg font-semibold text-gray-900">
                      Email Address
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      placeholder="Email address"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="customerAddress" className="text-lg font-semibold text-gray-900">
                      Street Address *
                    </Label>
                    <Input
                      id="customerAddress"
                      required
                      value={formData.customerAddress}
                      onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                      placeholder="Street address"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid gap-6 grid-cols-3">
                    <div className="space-y-4">
                      <Label htmlFor="customerCity" className="text-lg font-semibold text-gray-900">
                        City
                      </Label>
                      <Input
                        id="customerCity"
                        value={formData.customerCity}
                        onChange={(e) => handleInputChange("customerCity", e.target.value)}
                        placeholder="City"
                        className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="customerState" className="text-lg font-semibold text-gray-900">
                        State
                      </Label>
                      <Input
                        id="customerState"
                        value={formData.customerState}
                        onChange={(e) => handleInputChange("customerState", e.target.value)}
                        placeholder="State"
                        className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="customerZip" className="text-lg font-semibold text-gray-900">
                        ZIP Code
                      </Label>
                      <Input
                        id="customerZip"
                        value={formData.customerZip}
                        onChange={(e) => handleInputChange("customerZip", e.target.value)}
                        placeholder="ZIP code"
                        className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => setActiveTab("project-details")}
                size="lg"
                className="h-16 px-12 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-2xl"
              >
                Next: Project Details
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="project-details" className="space-y-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <Card className="bg-white rounded-3xl shadow-sm border-0 p-10">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <Label className="text-xl font-bold text-gray-900">Project Type</Label>
                    <RadioGroup
                      value={formData.projectType}
                      onValueChange={(value) => handleInputChange("projectType", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="residential" id="residential" className="h-6 w-6" />
                        <Label htmlFor="residential" className="text-lg text-gray-700">
                          Residential Property
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="commercial" id="commercial" className="h-6 w-6" />
                        <Label htmlFor="commercial" className="text-lg text-gray-700">
                          Commercial Property
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-xl font-bold text-gray-900">Project Area</Label>
                    <RadioGroup
                      value={formData.area}
                      onValueChange={(value) => handleInputChange("area", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="front-yard" id="front-yard" className="h-6 w-6" />
                        <Label htmlFor="front-yard" className="text-lg text-gray-700">
                          Front Yard
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="back-yard" id="back-yard" className="h-6 w-6" />
                        <Label htmlFor="back-yard" className="text-lg text-gray-700">
                          Back Yard
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="full-property" id="full-property" className="h-6 w-6" />
                        <Label htmlFor="full-property" className="text-lg text-gray-700">
                          Full Property
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="other" id="other-area" className="h-6 w-6" />
                        <Label htmlFor="other-area" className="text-lg text-gray-700">
                          Other Area
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-3xl shadow-sm border-0 p-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="budgetRange" className="text-xl font-bold text-gray-900">
                      Budget Range
                    </Label>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(value) => handleInputChange("budgetRange", value)}
                    >
                      <SelectTrigger className="h-16 text-lg rounded-2xl border-gray-200">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5k">Under $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="over-50k">Over $50,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="timeline" className="text-xl font-bold text-gray-900">
                      Desired Timeline
                    </Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger className="h-16 text-lg rounded-2xl border-gray-200">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="3-months">Within 3 months</SelectItem>
                        <SelectItem value="6-months">Within 6 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-white rounded-3xl shadow-sm border-0 p-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-xl font-bold text-gray-900">
                    Project Goals & Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what the customer wants to achieve with this project"
                    rows={8}
                    className="text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-6">
                  <Label className="text-xl font-bold text-gray-900">Site Photos</Label>
                  <div className="grid grid-cols-4 gap-8">
                    <Card className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors rounded-3xl border-2 border-dashed border-gray-200">
                      <CardContent className="flex flex-col items-center justify-center h-full p-8">
                        <Camera className="h-16 w-16 text-gray-400 mb-4" />
                        <span className="text-lg text-gray-500 text-center font-medium">Take Photo</span>
                      </CardContent>
                    </Card>
                    <Card className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors rounded-3xl border-2 border-dashed border-gray-200">
                      <CardContent className="flex flex-col items-center justify-center h-full p-8">
                        <Upload className="h-16 w-16 text-gray-400 mb-4" />
                        <span className="text-lg text-gray-500 text-center font-medium">Upload Photo</span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("customer-info")}
                size="lg"
                className="h-16 px-12 text-lg font-semibold rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                onClick={() => setActiveTab("design-overview")}
                size="lg"
                className="h-16 px-12 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-2xl"
              >
                Next: Design Overview
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="design-overview" className="space-y-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <Card className="bg-white rounded-3xl shadow-sm border-0 p-10">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <Label className="text-xl font-bold text-gray-900">Design Style Preference</Label>
                    <RadioGroup
                      value={formData.designStyle}
                      onValueChange={(value) => handleInputChange("designStyle", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="modern" id="modern" className="h-6 w-6" />
                        <Label htmlFor="modern" className="text-lg text-gray-700">
                          Modern/Contemporary
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="traditional" id="traditional" className="h-6 w-6" />
                        <Label htmlFor="traditional" className="text-lg text-gray-700">
                          Traditional
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="natural" id="natural" className="h-6 w-6" />
                        <Label htmlFor="natural" className="text-lg text-gray-700">
                          Natural/Woodland
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="xeriscape" id="xeriscape" className="h-6 w-6" />
                        <Label htmlFor="xeriscape" className="text-lg text-gray-700">
                          Xeriscape/Low-Water
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="other-style" id="other-style" className="h-6 w-6" />
                        <Label htmlFor="other-style" className="text-lg text-gray-700">
                          Other Style
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-xl font-bold text-gray-900">Maintenance Preference</Label>
                    <RadioGroup
                      value={formData.maintenanceLevel}
                      onValueChange={(value) => handleInputChange("maintenanceLevel", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="low" id="low-maintenance" className="h-6 w-6" />
                        <Label htmlFor="low-maintenance" className="text-lg text-gray-700">
                          Low Maintenance
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="medium" id="medium-maintenance" className="h-6 w-6" />
                        <Label htmlFor="medium-maintenance" className="text-lg text-gray-700">
                          Medium Maintenance
                        </Label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value="high" id="high-maintenance" className="h-6 w-6" />
                        <Label htmlFor="high-maintenance" className="text-lg text-gray-700">
                          High Maintenance
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-3xl shadow-sm border-0 p-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="plantPreferences" className="text-xl font-bold text-gray-900">
                      Plant Preferences
                    </Label>
                    <Textarea
                      id="plantPreferences"
                      value={formData.plantPreferences}
                      onChange={(e) => handleInputChange("plantPreferences", e.target.value)}
                      placeholder="Any specific plants or features the customer wants"
                      rows={8}
                      className="text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <Separator className="my-12" />

            <Card className="bg-white rounded-3xl shadow-sm border-0 p-10">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">Staff Design Notes</h3>

                <div className="space-y-4">
                  <Label htmlFor="initialDesignNotes" className="text-xl font-bold text-gray-900">
                    Initial Design Ideas
                  </Label>
                  <Textarea
                    id="initialDesignNotes"
                    value={formData.initialDesignNotes}
                    onChange={(e) => handleInputChange("initialDesignNotes", e.target.value)}
                    placeholder="Staff notes on initial design concepts and layout ideas"
                    rows={8}
                    className="text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="recommendedPlants" className="text-xl font-bold text-gray-900">
                    Recommended Plants & Features
                  </Label>
                  <Textarea
                    id="recommendedPlants"
                    value={formData.recommendedPlants}
                    onChange={(e) => handleInputChange("recommendedPlants", e.target.value)}
                    placeholder="Initial plant and feature recommendations based on customer preferences"
                    rows={6}
                    className="text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("project-details")}
                size="lg"
                className="h-16 px-12 text-lg font-semibold rounded-2xl border-gray-200 hover:bg-gray-50"
              >
                Back
              </Button>
              <div className="space-x-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-12 text-lg font-semibold rounded-2xl border-gray-200 hover:bg-gray-50"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={saving || !formData.customerName || !formData.customerAddress}
                  size="lg"
                  className="h-16 px-12 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-2xl"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {saving ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
