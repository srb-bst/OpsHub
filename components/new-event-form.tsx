"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface NewEventFormProps {
  selectedDate?: number | null
  onClose: () => void
}

export function NewEventForm({ selectedDate, onClose }: NewEventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: selectedDate ? `2025-06-${selectedDate.toString().padStart(2, "0")}` : "",
    time: "",
    duration: "",
    location: "",
    customer: "",
    phone: "",
    crew: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally save to database and create Outlook event
    console.log("Creating new event:", formData)

    // Show success message
    alert(
      `Event "${formData.title}" has been scheduled for ${formData.date} at ${formData.time}. Outlook calendar event created.`,
    )

    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Event Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="installation">Installation</SelectItem>
            <SelectItem value="job">Job/Project</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Event Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Johnson Backyard Consultation"
          required
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30min">30 minutes</SelectItem>
            <SelectItem value="1hour">1 hour</SelectItem>
            <SelectItem value="2hours">2 hours</SelectItem>
            <SelectItem value="halfday">Half day</SelectItem>
            <SelectItem value="fullday">Full day</SelectItem>
            <SelectItem value="multiday">Multiple days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Customer address or meeting location"
        />
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer Name</Label>
          <Input
            id="customer"
            value={formData.customer}
            onChange={(e) => handleChange("customer", e.target.value)}
            placeholder="Customer or contact name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Crew Assignment */}
      <div className="space-y-2">
        <Label htmlFor="crew">Assigned Crew</Label>
        <Select value={formData.crew} onValueChange={(value) => handleChange("crew", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select crew (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team-a">Team A (Tom Wilson)</SelectItem>
            <SelectItem value="team-b">Team B (Mike Rodriguez)</SelectItem>
            <SelectItem value="team-c">Team C (Sarah Chen)</SelectItem>
            <SelectItem value="design-team">Design Team</SelectItem>
            <SelectItem value="maintenance">Maintenance Crew</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Special instructions, equipment needed, etc."
          rows={3}
        />
      </div>

      {/* Event Type Preview */}
      {formData.type && (
        <Card className="bg-slate-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {formData.type === "consultation" && (
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              )}
              {formData.type === "installation" && (
                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-amber-600" />
                </div>
              )}
              {formData.type === "job" && (
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
              )}
              {formData.type === "delivery" && (
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              )}
              {formData.type === "maintenance" && (
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
              )}
              {formData.type === "meeting" && (
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
              )}
              <div>
                <div className="font-medium text-slate-900">
                  {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Event
                </div>
                <div className="text-sm text-slate-500">
                  {formData.type === "consultation" && "Customer meeting and site evaluation"}
                  {formData.type === "installation" && "Plant or feature installation"}
                  {formData.type === "job" && "Multi-day project work"}
                  {formData.type === "delivery" && "Material or plant delivery"}
                  {formData.type === "maintenance" && "Ongoing maintenance work"}
                  {formData.type === "meeting" && "Internal meeting or appointment"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-lg border-slate-200">
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
          disabled={!formData.title || !formData.type || !formData.date || !formData.time}
        >
          Create Event
        </Button>
      </div>
    </form>
  )
}
