"use client"

import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Plus,
  Calendar,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { NewEventForm } from "@/components/new-event-form"
import { ProjectSchedulingForm } from "@/components/project-scheduling-form"

interface SchedulingProject {
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

interface ConsultationScheduling {
  leadId: string
  title: string
  customer: string
  phone: string
  address: string
  services: string
}

interface CrewMember {
  id: string
  name: string
  initials: string
  role: string
  availability: "available" | "busy" | "unavailable"
  currentJobs: number
  maxJobs: number
}

const crewMembers: CrewMember[] = [
  {
    id: "1",
    name: "Mike Rodriguez",
    initials: "MR",
    role: "Lead Installer",
    availability: "available",
    currentJobs: 1,
    maxJobs: 2,
  },
  {
    id: "2",
    name: "Tom Wilson",
    initials: "TW",
    role: "Installation Specialist",
    availability: "busy",
    currentJobs: 2,
    maxJobs: 2,
  },
  {
    id: "3",
    name: "Carlos Garcia",
    initials: "CG",
    role: "Hardscape Specialist",
    availability: "available",
    currentJobs: 0,
    maxJobs: 2,
  },
  {
    id: "4",
    name: "James Chen",
    initials: "JC",
    role: "Maintenance Lead",
    availability: "available",
    currentJobs: 1,
    maxJobs: 3,
  },
]

// Mock data for existing scheduled jobs to check conflicts
const existingJobs = [
  { date: 18, crewId: "2", title: "Garcia Backyard" },
  { date: 19, crewId: "2", title: "Garcia Backyard" },
  { date: 20, crewId: "2", title: "Garcia Backyard" },
  { date: 21, crewId: "2", title: "Garcia Backyard" },
  { date: 22, crewId: "2", title: "Garcia Backyard" },
  { date: 24, crewId: "1", title: "Thompson Patio" },
  { date: 25, crewId: "1", title: "Thompson Patio" },
]

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState("June 2025")
  const [viewType, setViewType] = useState("month")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [showNewEventDialog, setShowNewEventDialog] = useState(false)
  const [showProjectSchedulingDialog, setShowProjectSchedulingDialog] = useState(false)
  const [showConsultationDialog, setShowConsultationDialog] = useState(false)
  const [showLeadDetailsDialog, setShowLeadDetailsDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [schedulingProject, setSchedulingProject] = useState<SchedulingProject | null>(null)
  const [consultationScheduling, setConsultationScheduling] = useState<ConsultationScheduling | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  // Check for scheduling parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const scheduleType = urlParams.get("schedule")
    const scheduleId = urlParams.get("scheduleId")
    const projectName = urlParams.get("project")

    // Handle consultation scheduling
    if (scheduleType === "consultation") {
      const title = urlParams.get("title")
      const customer = urlParams.get("customer")
      const phone = urlParams.get("phone")
      const address = urlParams.get("address")
      const services = urlParams.get("services")
      const leadId = urlParams.get("leadId")

      if (title && customer && leadId) {
        setConsultationScheduling({
          leadId,
          title: decodeURIComponent(title),
          customer: decodeURIComponent(customer),
          phone: phone ? decodeURIComponent(phone) : "",
          address: address ? decodeURIComponent(address) : "",
          services: services ? decodeURIComponent(services) : "",
        })
      }
    }
    // Handle project scheduling
    else if (scheduleId && projectName) {
      const mockProject: SchedulingProject = {
        id: scheduleId,
        customerName: decodeURIComponent(projectName),
        address: "123 Oak Street, Springfield",
        phone: "(555) 123-4567",
        services: ["Design", "Installation"],
        estimatedValue: "$15,500",
        estimatedDuration: "3 days",
        priority: "high",
        specialRequirements: "Customer prefers morning start times. Small backyard access.",
        blueSheetId: "BS-2025-005",
        estimateId: "EST-2025-005",
      }
      setSchedulingProject(mockProject)
    }
  }, [])

  const handleEventClick = (event) => {
    // Check if this is a consultation event with lead info
    if (event.leadId) {
      setSelectedLeadId(event.leadId)
      setShowLeadDetailsDialog(true)
    } else {
      setSelectedEvent(event)
      setShowEventDetails(true)
    }
  }

  const handleDateClick = (date) => {
    if (consultationScheduling) {
      // Handle consultation scheduling
      setSelectedDate(date)
      setShowConsultationDialog(true)
    } else if (schedulingProject) {
      // Handle project scheduling
      setSelectedDate(date)
      setShowProjectSchedulingDialog(true)
    } else {
      // Handle regular event creation
      setSelectedDate(date)
      setShowNewEventDialog(true)
    }
  }

  const handleConsultationScheduled = (scheduleData) => {
    console.log("Consultation scheduled:", scheduleData)

    // Show success message
    alert(
      `Consultation with ${consultationScheduling?.customer} has been scheduled for June ${selectedDate} at ${scheduleData.time}. Outlook calendar event created and notifications sent.`,
    )

    // Clear scheduling mode
    setConsultationScheduling(null)
    setShowConsultationDialog(false)

    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const handleProjectScheduled = (scheduleData) => {
    console.log("Project scheduled:", scheduleData)

    // Show success message
    alert(
      `${schedulingProject?.customerName} has been scheduled for June ${selectedDate} with ${scheduleData.crewName}. Outlook calendar event created and notifications sent.`,
    )

    // Clear scheduling mode
    setSchedulingProject(null)
    setShowProjectSchedulingDialog(false)

    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const cancelScheduling = () => {
    setSchedulingProject(null)
    setConsultationScheduling(null)
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const handleNewEvent = () => {
    setSelectedDate(null)
    setShowNewEventDialog(true)
  }

  const getDateAvailability = (date: number) => {
    const jobsOnDate = existingJobs.filter((job) => job.date === date)
    const availableCrews = crewMembers.filter(
      (crew) => crew.availability === "available" && !jobsOnDate.some((job) => job.crewId === crew.id),
    )

    return {
      hasConflicts: jobsOnDate.length > 0,
      availableCrews: availableCrews.length,
      totalCrews: crewMembers.length,
      jobsOnDate,
    }
  }

  const getDateClassName = (date: number, isToday: boolean) => {
    const availability = getDateAvailability(date)
    let className = `min-h-[160px] hover:bg-accent/50 transition-colors cursor-pointer ${
      isToday ? "ring-2 ring-emerald-500 bg-emerald-50/30" : ""
    }`

    if (schedulingProject || consultationScheduling) {
      if (availability.availableCrews === 0 && schedulingProject) {
        className += " hover:bg-red-100 border-red-200 bg-red-50/30"
      } else if (availability.hasConflicts && schedulingProject) {
        className += " hover:bg-yellow-100 border-yellow-200 bg-yellow-50/30"
      } else {
        className += " hover:bg-emerald-100 hover:border-emerald-300 bg-emerald-50/20"
      }
    }

    return className
  }

  return (
    <div className="p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" className="h-12 w-12">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{currentMonth}</h1>
          <Button variant="outline" size="lg" className="h-12 w-12">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleNewEvent}
            className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Event
          </Button>
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-[140px] h-12 text-base">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-12 text-base">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="consultations">Consultations</SelectItem>
              <SelectItem value="installations">Installations</SelectItem>
              <SelectItem value="jobs">Jobs</SelectItem>
              <SelectItem value="deliveries">Deliveries</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Scheduling Banner for Projects */}
      {schedulingProject && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-emerald-600" />
                <div>
                  <CardTitle className="text-emerald-900">Scheduling: {schedulingProject.customerName}</CardTitle>
                  <p className="text-sm text-emerald-800 mt-1">
                    {schedulingProject.estimatedValue} • {schedulingProject.estimatedDuration} •{" "}
                    {schedulingProject.priority} priority
                  </p>
                </div>
              </div>
              <Button
                onClick={cancelScheduling}
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <MapPin className="h-4 w-4" />
                <span>{schedulingProject.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <Phone className="h-4 w-4" />
                <span>{schedulingProject.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <User className="h-4 w-4" />
                <span>{schedulingProject.services.join(", ")}</span>
              </div>
            </div>

            {schedulingProject.specialRequirements && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <div className="text-xs font-medium text-blue-900 mb-1">Special Requirements:</div>
                <div className="text-xs text-blue-800">{schedulingProject.specialRequirements}</div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-800">Available dates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <span className="text-emerald-800">Limited availability</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <span className="text-emerald-800">No availability</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultation Scheduling Banner */}
      {consultationScheduling && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-blue-900">
                    Scheduling Consultation: {consultationScheduling.customer}
                  </CardTitle>
                  <p className="text-sm text-blue-800 mt-1">Services: {consultationScheduling.services}</p>
                </div>
              </div>
              <Button
                onClick={cancelScheduling}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <MapPin className="h-4 w-4" />
                <span>{consultationScheduling.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Phone className="h-4 w-4" />
                <span>{consultationScheduling.phone}</span>
              </div>
            </div>
            <div className="text-sm text-blue-800">Click any available date to schedule this consultation</div>
          </CardContent>
        </Card>
      )}

      {viewType === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
            <div key={day} className="text-center font-semibold p-4 text-lg">
              {day}
            </div>
          ))}

          {/* Previous month days - grayed out */}
          {[26, 27, 28, 29, 30, 31].map((day) => (
            <Card key={`prev-${day}`} className="min-h-[160px] bg-muted/50">
              <CardContent className="p-4">
                <div className="text-muted-foreground text-lg">{day}</div>
              </CardContent>
            </Card>
          ))}

          {/* Current month days */}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isToday = day === 17 // June 17, 2025 for demo
            const availability = getDateAvailability(day)

            return (
              <Card key={day} className={getDateClassName(day, isToday)} onClick={() => handleDateClick(day)}>
                <CardContent className="p-4">
                  <div
                    className={`font-semibold text-lg mb-2 flex items-center justify-between ${isToday ? "text-emerald-700" : ""}`}
                  >
                    <span>
                      {day}
                      {isToday && (
                        <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">TODAY</span>
                      )}
                    </span>

                    {/* Availability indicators for scheduling mode */}
                    {(schedulingProject || consultationScheduling) && (
                      <div className="flex items-center gap-1">
                        {schedulingProject && availability.availableCrews === 0 ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : schedulingProject && availability.hasConflicts ? (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Crew availability info for project scheduling */}
                  {schedulingProject && (
                    <div className="mb-2 text-xs">
                      <div
                        className={`font-medium ${
                          availability.availableCrews === 0
                            ? "text-red-700"
                            : availability.hasConflicts
                              ? "text-yellow-700"
                              : "text-emerald-700"
                        }`}
                      >
                        {availability.availableCrews}/{availability.totalCrews} crews available
                      </div>
                      {availability.jobsOnDate.length > 0 && (
                        <div className="text-slate-500 mt-1">
                          {availability.jobsOnDate.map((job, idx) => (
                            <div key={idx} className="truncate">
                              {job.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Existing events */}
                  {day === 17 && (
                    <div className="space-y-2">
                      <CalendarEvent
                        time="8:00 AM"
                        title="Johnson Consultation"
                        type="consultation"
                        leadId="1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({
                            time: "8:00 AM",
                            title: "Johnson Consultation",
                            type: "consultation",
                            leadId: "1",
                          })
                        }}
                      />
                      <CalendarEvent
                        time="10:30 AM"
                        title="Maple Tree Installation"
                        type="installation"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "10:30 AM", title: "Maple Tree Installation", type: "installation" })
                        }}
                      />
                    </div>
                  )}
                  {day === 18 && (
                    <div className="space-y-2">
                      <CalendarEvent
                        time="All Day"
                        title="Garcia Backyard"
                        type="job"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "All Day", title: "Garcia Backyard", type: "job" })
                        }}
                      />
                    </div>
                  )}
                  {day === 19 && (
                    <div className="space-y-2">
                      <CalendarEvent
                        time="All Day"
                        title="Garcia Backyard"
                        type="job"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "All Day", title: "Garcia Backyard", type: "job" })
                        }}
                      />
                      <CalendarEvent
                        time="3:30 PM"
                        title="Williams Design Review"
                        type="consultation"
                        leadId="3"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({
                            time: "3:30 PM",
                            title: "Williams Design Review",
                            type: "consultation",
                            leadId: "3",
                          })
                        }}
                      />
                    </div>
                  )}
                  {day === 20 && (
                    <div className="space-y-2">
                      <CalendarEvent
                        time="All Day"
                        title="Garcia Backyard"
                        type="job"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "All Day", title: "Garcia Backyard", type: "job" })
                        }}
                      />
                      <CalendarEvent
                        time="9:00 AM"
                        title="Davis Shrub Installation"
                        type="installation"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "9:00 AM", title: "Davis Shrub Installation", type: "installation" })
                        }}
                      />
                    </div>
                  )}
                  {day === 21 && (
                    <div className="space-y-2">
                      <CalendarEvent
                        time="All Day"
                        title="Garcia Backyard"
                        type="job"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "All Day", title: "Garcia Backyard", type: "job" })
                        }}
                      />
                      <CalendarEvent
                        time="1:00 PM"
                        title="Miller Design Review"
                        type="consultation"
                        leadId="4"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({
                            time: "1:00 PM",
                            title: "Miller Design Review",
                            type: "consultation",
                            leadId: "4",
                          })
                        }}
                      />
                    </div>
                  )}
                  {day === 22 && (
                    <div className="space-y-2">
                      <CalendarEvent
                        time="All Day"
                        title="Garcia Backyard"
                        type="job"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "All Day", title: "Garcia Backyard", type: "job" })
                        }}
                      />
                      <CalendarEvent
                        time="1:00 PM"
                        title="Downtown Planters"
                        type="installation"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick({ time: "1:00 PM", title: "Downtown Planters", type: "installation" })
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* Next month days - grayed out */}
          {[1, 2, 3, 4, 5, 6].map((day) => (
            <Card key={`next-${day}`} className="min-h-[160px] bg-muted/50">
              <CardContent className="p-4">
                <div className="text-muted-foreground text-lg">{day}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>{selectedEvent ? selectedEvent.title : "No event selected"}</DialogDescription>
          </DialogHeader>
          {selectedEvent && <EventOverview event={selectedEvent} onClose={() => setShowEventDetails(false)} />}
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={showLeadDetailsDialog} onOpenChange={setShowLeadDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>Consultation details and lead information</DialogDescription>
          </DialogHeader>
          {selectedLeadId && (
            <LeadDetailsPopup leadId={selectedLeadId} onClose={() => setShowLeadDetailsDialog(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* New Event Dialog */}
      <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              {selectedDate ? `Schedule an event for June ${selectedDate}` : "Schedule a new event"}
            </DialogDescription>
          </DialogHeader>
          <NewEventForm selectedDate={selectedDate} onClose={() => setShowNewEventDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Consultation Scheduling Dialog */}
      <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Consultation</DialogTitle>
            <DialogDescription>
              Schedule consultation with {consultationScheduling?.customer} for June {selectedDate}
            </DialogDescription>
          </DialogHeader>
          {consultationScheduling && selectedDate && (
            <ConsultationSchedulingForm
              consultation={consultationScheduling}
              selectedDate={selectedDate}
              onSchedule={handleConsultationScheduled}
              onClose={() => setShowConsultationDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Project Scheduling Dialog */}
      <Dialog open={showProjectSchedulingDialog} onOpenChange={setShowProjectSchedulingDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Project</DialogTitle>
            <DialogDescription>
              Schedule {schedulingProject?.customerName} for June {selectedDate}
            </DialogDescription>
          </DialogHeader>
          {schedulingProject && selectedDate && (
            <ProjectSchedulingForm
              project={schedulingProject}
              selectedDate={selectedDate}
              availableCrews={crewMembers.filter(
                (crew) =>
                  crew.availability === "available" &&
                  !existingJobs.some((job) => job.date === selectedDate && job.crewId === crew.id),
              )}
              onSchedule={handleProjectScheduled}
              onClose={() => setShowProjectSchedulingDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Calendar Event Component with Lead ID support
interface CalendarEventProps {
  time: string
  title: string
  type: "consultation" | "installation" | "job"
  leadId?: string
  onClick?: (e: React.MouseEvent) => void
}

function CalendarEvent({ time, title, type, leadId, onClick }: CalendarEventProps) {
  return (
    <div className="text-sm p-2 rounded cursor-pointer hover:bg-accent transition-colors" onClick={onClick}>
      {type === "consultation" && (
        <div className={`bg-blue-100 text-blue-800 p-2 rounded ${leadId ? "ring-2 ring-blue-300" : ""}`}>
          <div className="font-medium">{time}</div>
          <div className="truncate">{title}</div>
          {leadId && <div className="text-xs opacity-75">Click for lead details</div>}
        </div>
      )}
      {type === "installation" && (
        <div className="bg-amber-100 text-amber-800 p-2 rounded">
          <div className="font-medium">{time}</div>
          <div className="truncate">{title}</div>
        </div>
      )}
      {type === "job" && (
        <div className="bg-green-100 text-green-800 p-2 rounded">
          <div className="font-medium">{time}</div>
          <div className="truncate">{title}</div>
        </div>
      )}
    </div>
  )
}

// Lead Details Popup Component
interface LeadDetailsPopupProps {
  leadId: string
  onClose: () => void
}

function LeadDetailsPopup({ leadId, onClose }: LeadDetailsPopupProps) {
  // Mock lead data - in real app this would come from API
  const mockLeads = {
    "1": {
      name: "Sarah Johnson",
      phone: "(555) 123-4567",
      email: "sarah.johnson@email.com",
      address: "123 Oak Street, Springfield",
      services: ["Design", "Installation"],
      description: "Looking for front yard redesign with low-maintenance plants",
      status: "consultation-needed",
      priority: "high",
    },
    "3": {
      name: "Jennifer Martinez",
      phone: "(555) 345-6789",
      email: "jennifer.martinez@email.com",
      address: "789 Pine Road, Springfield",
      services: ["Design", "Hardscape"],
      description: "Complete backyard renovation including patio and landscaping",
      status: "consultation-needed",
      priority: "high",
    },
    "4": {
      name: "Robert Wilson",
      phone: "(555) 456-7890",
      email: "robert.wilson@email.com",
      address: "321 Cedar Lane, Springfield",
      services: ["Design", "Installation"],
      description: "Interested in drought-resistant landscaping for large property",
      status: "consultation-needed",
      priority: "medium",
    },
  }

  const lead = mockLeads[leadId]

  if (!lead) {
    return <div>Lead not found</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <h3 className="font-semibold text-lg">{lead.name}</h3>
          <div className="text-sm text-slate-600 space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              {lead.phone}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {lead.address}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Services Requested</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {lead.services.map((service) => (
              <span key={service} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">
                {service}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Description</label>
          <p className="mt-1 text-sm text-slate-900">{lead.description}</p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600"
            onClick={() => window.open(`/leads/${leadId}`, "_blank")}
          >
            View Full Lead Details
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 h-10">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// Consultation Scheduling Form Component
interface ConsultationSchedulingFormProps {
  consultation: ConsultationScheduling
  selectedDate: number
  onSchedule: (data: any) => void
  onClose: () => void
}

function ConsultationSchedulingForm({
  consultation,
  selectedDate,
  onSchedule,
  onClose,
}: ConsultationSchedulingFormProps) {
  const [formData, setFormData] = useState({
    time: "",
    duration: "1hour",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSchedule({
      ...formData,
      date: selectedDate,
      customer: consultation.customer,
      leadId: consultation.leadId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900">{consultation.title}</h3>
        <div className="text-sm text-blue-800 mt-1">
          <div>{consultation.address}</div>
          <div>{consultation.phone}</div>
          <div>Services: {consultation.services}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Time</label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Duration</label>
          <Select
            value={formData.duration}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30min">30 minutes</SelectItem>
              <SelectItem value="1hour">1 hour</SelectItem>
              <SelectItem value="2hours">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Special instructions or preparation notes..."
          rows={3}
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-10">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600" disabled={!formData.time}>
          Schedule Consultation
        </Button>
      </div>
    </form>
  )
}

interface EventOverviewProps {
  event: any
  onClose: () => void
}

function EventOverview({ event, onClose }: EventOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">Event Details</h3>
        <p className="text-slate-500">Event details would be displayed here.</p>
      </div>
    </div>
  )
}
