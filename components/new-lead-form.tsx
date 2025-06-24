"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Camera, MapPin, Phone, User, Building, Globe } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewLeadForm() {
  const [leadSource, setLeadSource] = useState<string>("")
  const [services, setServices] = useState<string[]>([])

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setServices([...services, service])
    } else {
      setServices(services.filter((s) => s !== service))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted")
    // In a real app, this would save to database
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-4xl mx-auto pt-16 lg:pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/leads">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">New Lead</h1>
            <p className="text-slate-600">Capture customer information and requirements</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lead Source Selection */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Lead Source</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <RadioGroup
                value={leadSource}
                onValueChange={setLeadSource}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="website" id="website" />
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="website" className="text-sm font-medium cursor-pointer">
                      Website
                    </Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="phone" id="phone" />
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="phone" className="text-sm font-medium cursor-pointer">
                      Phone Call
                    </Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="nursery" id="nursery" />
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="nursery" className="text-sm font-medium cursor-pointer">
                      Nursery Walk-in
                    </Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="referral" id="referral" />
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <Label htmlFor="referral" className="text-sm font-medium cursor-pointer">
                      Referral
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    className="h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    className="h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    className="h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Property Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="address"
                    placeholder="123 Main Street, City, State, ZIP"
                    className="pl-10 h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Interested */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Services of Interest</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Design",
                  "Installation",
                  "Delivery",
                  "Hardscape",
                  "Irrigation",
                  "Maintenance",
                  "Tree Services",
                  "Mulch/Stone",
                  "Other",
                ].map((service) => (
                  <div
                    key={service}
                    className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <Checkbox
                      id={service}
                      checked={services.includes(service)}
                      onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                    />
                    <Label htmlFor={service} className="text-sm font-medium cursor-pointer flex-1">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeline" className="text-sm font-medium text-slate-700">
                    Desired Timeline
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
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
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium text-slate-700">
                    Budget Range
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what the customer is looking for..."
                  rows={4}
                  className="text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Site Photos (Optional)</Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 flex flex-col items-center justify-center gap-2"
                    onClick={() => {
                      // Handle photo capture/upload
                      console.log("Photo capture clicked")
                    }}
                  >
                    <Camera className="h-6 w-6 text-slate-400" />
                    <span className="text-xs text-slate-500">Take Photo</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority and Notes */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Lead Priority & Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Priority Level</Label>
                <RadioGroup defaultValue="medium" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      High
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                  Initial Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this lead..."
                  rows={3}
                  className="text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-4">
            <Button
              variant="outline"
              asChild
              className="flex-1 h-12 text-base font-medium rounded-lg border-slate-200 hover:bg-slate-50"
            >
              <Link href="/leads">Cancel</Link>
            </Button>
            <Button className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg">
              Save Lead
            </Button>
            <Button className="flex-1 h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 rounded-lg">
              Save & Assign
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
