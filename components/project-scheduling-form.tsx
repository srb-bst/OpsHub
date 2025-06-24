"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, MapPin, Phone, AlertTriangle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProjectSchedulingFormProps {
  project: {
    id: string
    customerName: string
    address: string
    phone: string
    services: string[]
    estimatedValue: string
    estimatedDuration: string
    priority: "low" | "medium" | "high"
    specialRequirements?: string
    blueSheetId: string
    estimateId: string
  }
  selectedDate: number
  availableCrews: Array<{
    id: string
    name: string
    initials: string
    role: string
    availability: string
    currentJobs: number
    maxJobs: number
  }>
  onSchedule: (scheduleData: any) => void
  onClose: () => void
}

export function ProjectSchedulingForm({
  project,
  selectedDate,
  availableCrews,
  onSchedule,
  onClose,
}: ProjectSchedulingFormProps) {
  const [formData, setFormData] = useState({
    crewId: "",
    startTime: "08:00",
    duration: project.estimatedDuration || "1 day",
    notes: "",
    customerNotification: true,
    outlookSync: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedCrew = availableCrews.find((crew) => crew.id === formData.crewId)
    if (!selectedCrew) return

    const scheduleData = {
      projectId: project.id,
      date: `June ${selectedDate}, 2025`,
      crewId: formData.crewId,
      crewName: selectedCrew.name,
      startTime: formData.startTime,
      duration: formData.duration,
      notes: formData.notes,
      customerNotification: formData.customerNotification,
      outlookSync: formData.outlookSync,
    }

    onSchedule(scheduleData)
  }

  const isFormValid = formData.crewId && formData.startTime

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Summary */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-emerald-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduling: {project.customerName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-emerald-800">
              <MapPin className="h-4 w-4" />
              <span>{project.address}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800">
              <Phone className="h-4 w-4" />
              <span>{project.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{project.estimatedValue}</Badge>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">{project.estimatedDuration}</Badge>
            <Badge
              className={`${
                project.priority === "high"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : project.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-green-100 text-green-800 border-green-200"
              }`}
            >
              {project.priority} priority
            </Badge>
          </div>
          <div className="text-sm text-emerald-800">
            <strong>Services:</strong> {project.services.join(", ")}
          </div>
          {project.specialRequirements && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs font-medium text-blue-900 mb-1">Special Requirements:</div>
              <div className="text-xs text-blue-800">{project.specialRequirements}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduling Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Selected Date</Label>
            <div className="p-3 bg-slate-50 rounded-lg border">
              <div className="font-medium text-slate-900">June {selectedDate}, 2025</div>
              <div className="text-sm text-slate-600">
                {new Date(2025, 5, selectedDate).toLocaleDateString("en-US", { weekday: "long" })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Half day">Half day</SelectItem>
                <SelectItem value="1 day">1 day</SelectItem>
                <SelectItem value="2 days">2 days</SelectItem>
                <SelectItem value="3 days">3 days</SelectItem>
                <SelectItem value="1 week">1 week</SelectItem>
                <SelectItem value="2 weeks">2 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Assign Crew</Label>
            <Select
              value={formData.crewId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, crewId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crew member" />
              </SelectTrigger>
              <SelectContent>
                {availableCrews.map((crew) => (
                  <SelectItem key={crew.id} value={crew.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-medium text-emerald-700">
                        {crew.initials}
                      </div>
                      <div>
                        <div className="font-medium">{crew.name}</div>
                        <div className="text-xs text-slate-500">
                          {crew.role} • {crew.currentJobs}/{crew.maxJobs} jobs
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableCrews.length === 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">No crews available</span>
              </div>
              <p className="text-xs text-red-700 mt-1">All crews are busy on this date. Please select another date.</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Scheduling Notes</Label>
          <Textarea
            id="notes"
            placeholder="Special instructions, equipment needs, or other notes..."
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="customerNotification"
              checked={formData.customerNotification}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerNotification: e.target.checked }))}
              className="h-4 w-4 text-emerald-600 rounded border-slate-300"
            />
            <Label htmlFor="customerNotification" className="text-sm">
              Send notification to customer
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="outlookSync"
              checked={formData.outlookSync}
              onChange={(e) => setFormData((prev) => ({ ...prev, outlookSync: e.target.checked }))}
              className="h-4 w-4 text-emerald-600 rounded border-slate-300"
            />
            <Label htmlFor="outlookSync" className="text-sm">
              Create Outlook calendar event
            </Label>
          </div>
        </div>
      </div>

      {/* Confirmation Summary */}
      {formData.crewId && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Scheduling Summary</span>
            </div>
            <div className="text-sm text-green-800 space-y-1">
              <div>
                <strong>{project.customerName}</strong> will be scheduled for <strong>June {selectedDate}, 2025</strong>{" "}
                at <strong>{formData.startTime}</strong>
              </div>
              <div>
                Assigned to: <strong>{availableCrews.find((c) => c.id === formData.crewId)?.name}</strong>
              </div>
              <div>
                Duration: <strong>{formData.duration}</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-emerald-500 hover:bg-emerald-600"
          disabled={!isFormValid || availableCrews.length === 0}
        >
          {!isFormValid && <AlertTriangle className="h-4 w-4 mr-2" />}
          Schedule Project
        </Button>
      </div>
    </form>
  )
}
