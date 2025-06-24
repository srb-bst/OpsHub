"use client"

import { useState } from "react"
import { ArrowLeft, User, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export function NewBlueSheet() {
  const [selectedLead, setSelectedLead] = useState<string>("")
  const [services, setServices] = useState<string[]>([])

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setServices([...services, service])
    } else {
      setServices(services.filter((s) => s !== service))
    }
  }

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-4xl mx-auto pt-16 lg:pt-0">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-white/80">
            <Link href="/blue-sheets">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">New Blue Sheet</h1>
            <p className="text-slate-600">Create project documentation from assigned lead</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Lead Selection */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Select Assigned Lead</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <Select value={selectedLead} onValueChange={setSelectedLead}>
                <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
                  <SelectValue placeholder="Choose from your assigned leads" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sarah Johnson - 123 Oak Street (Design, Installation)</SelectItem>
                  <SelectItem value="2">Jennifer Martinez - 789 Pine Road (Design, Hardscape)</SelectItem>
                  <SelectItem value="3">Robert Wilson - 321 Cedar Lane (Design, Installation)</SelectItem>
                </SelectContent>
              </Select>
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
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="firstName"
                      placeholder="First name"
                      className="pl-10 h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
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
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="pl-10 h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@example.com"
                      className="pl-10 h-12 text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
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

          {/* Project Details */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Services Required</Label>
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
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-sm font-medium text-slate-700">
                    Project Type
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="hoa">HOA/Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectArea" className="text-sm font-medium text-slate-700">
                    Project Area
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 text-base rounded-lg border-slate-200">
                      <SelectValue placeholder="Select project area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front-yard">Front Yard</SelectItem>
                      <SelectItem value="back-yard">Back Yard</SelectItem>
                      <SelectItem value="full-property">Full Property</SelectItem>
                      <SelectItem value="commercial-grounds">Commercial Grounds</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription" className="text-sm font-medium text-slate-700">
                  Project Description
                </Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe the customer's vision and requirements..."
                  rows={4}
                  className="text-base rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Initial Assessment */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">Initial Assessment</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Project Priority</Label>
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

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="estimatedBudget" className="text-sm font-medium text-slate-700">
                    Estimated Budget Range
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialNotes" className="text-sm font-medium text-slate-700">
                  Initial Designer Notes
                </Label>
                <Textarea
                  id="initialNotes"
                  placeholder="Add your initial thoughts, observations, and next steps..."
                  rows={4}
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
              <Link href="/blue-sheets">Cancel</Link>
            </Button>
            <Button className="flex-1 h-12 text-base font-medium bg-slate-500 hover:bg-slate-600 rounded-lg">
              Save as Draft
            </Button>
            <Button className="flex-1 h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg">
              Create Blue Sheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
