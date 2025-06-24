"use client"

import { useState } from "react"
import { Camera, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CustomerDesignIntake() {
  const [activeTab, setActiveTab] = useState("customer-info")

  return (
    <div className="p-12 bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">New Project</h1>
          <p className="text-xl text-gray-600">Create a new landscaping design project for a customer</p>
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
                    <Label htmlFor="first-name" className="text-lg font-semibold text-gray-900">
                      First Name
                    </Label>
                    <Input
                      id="first-name"
                      placeholder="First name"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="last-name" className="text-lg font-semibold text-gray-900">
                      Last Name
                    </Label>
                    <Input
                      id="last-name"
                      placeholder="Last name"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="email" className="text-lg font-semibold text-gray-900">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="phone" className="text-lg font-semibold text-gray-900">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Phone number"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="address" className="text-lg font-semibold text-gray-900">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid gap-6 grid-cols-3">
                    <div className="space-y-4">
                      <Label htmlFor="city" className="text-lg font-semibold text-gray-900">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="City"
                        className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="state" className="text-lg font-semibold text-gray-900">
                        State
                      </Label>
                      <Input
                        id="state"
                        placeholder="State"
                        className="h-16 text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="zip" className="text-lg font-semibold text-gray-900">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
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
                    <RadioGroup defaultValue="residential" className="space-y-4">
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
                    <RadioGroup defaultValue="front-yard" className="space-y-4">
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
                    <Label htmlFor="budget" className="text-xl font-bold text-gray-900">
                      Budget Range
                    </Label>
                    <Select>
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
                    <Select>
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
                  <Label htmlFor="goals" className="text-xl font-bold text-gray-900">
                    Project Goals & Description
                  </Label>
                  <Textarea
                    id="goals"
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
                    <RadioGroup defaultValue="modern" className="space-y-4">
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
                    <RadioGroup defaultValue="low" className="space-y-4">
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
                    <Label htmlFor="plant-preferences" className="text-xl font-bold text-gray-900">
                      Plant Preferences
                    </Label>
                    <Textarea
                      id="plant-preferences"
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
                  <Label htmlFor="initial-design-notes" className="text-xl font-bold text-gray-900">
                    Initial Design Ideas
                  </Label>
                  <Textarea
                    id="initial-design-notes"
                    placeholder="Staff notes on initial design concepts and layout ideas"
                    rows={8}
                    className="text-lg rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="recommended-plants" className="text-xl font-bold text-gray-900">
                    Recommended Plants & Features
                  </Label>
                  <Textarea
                    id="recommended-plants"
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
                  size="lg"
                  className="h-16 px-12 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-2xl"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
