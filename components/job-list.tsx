"use client"

import { CalendarDays, CheckCircle2, CircleDashed, Clock, Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const mockJobs = [
  {
    id: "1",
    title: "Garcia Backyard Renovation",
    customerName: "Maria Garcia",
    address: "789 Pine Road, Springfield",
    phone: "(555) 456-7890",
    status: "in-progress" as const,
    priority: "high" as const,
    startDate: "June 15, 2025",
    estimatedCompletion: "June 22, 2025",
    assignedCrew: "Tom Wilson",
    crewSize: 3,
    projectValue: "$42,000",
    progress: 40,
    services: ["Hardscape", "Installation"],
    lastUpdate: "2 hours ago",
    issues: 1,
    blueSheetId: "BS-2025-001",
    estimateId: "EST-2025-001",
    currentDay: 3,
    totalDays: 7,
    onSchedule: true,
    weatherStatus: "Clear - Good for outdoor work",
    recentPhotos: 8,
    materialsStatus: "good" as const,
    qualityChecks: { passed: 2, total: 3 },
  },
]

export function JobList() {
  return (
    <div className="space-y-4">
      {mockJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

interface JobCardProps {
  job: {
    id: string
    title: string
    customerName: string
    address: string
    phone: string
    status: "scheduled" | "in-progress" | "completed"
    priority: "high" | "medium" | "low"
    startDate: string
    estimatedCompletion: string
    assignedCrew: string
    crewSize: number
    projectValue: string
    progress: number
    services: string[]
    lastUpdate: string
    issues: number
    blueSheetId: string
    estimateId: string
    currentDay: number
    totalDays: number
    onSchedule: boolean
    weatherStatus: string
    recentPhotos: number
    materialsStatus: "good" | "low" | "critical"
    qualityChecks: { passed: number; total: number }
  }
}

function JobCard({ job }: JobCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{job.title}</CardTitle>
          {job.status === "scheduled" && (
            <Badge variant="secondary">
              <CalendarDays className="mr-1 h-3 w-3" />
              Scheduled
            </Badge>
          )}
          {job.status === "in-progress" && (
            <Badge className="bg-amber-500">
              <CircleDashed className="mr-1 h-3 w-3" />
              In Progress
            </Badge>
          )}
          {job.status === "completed" && (
            <Badge className="bg-green-600">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">{job.address}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Leaf className="mr-1 h-3 w-3" />
              {job.services.join(", ")}
            </Badge>
            <div className="text-sm font-medium">
              {job.startDate} - {job.estimatedCompletion}
            </div>
          </div>

          {job.status !== "scheduled" && (
            <div className="space-y-1 mt-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm mt-1">
            <div>
              <span className="font-medium">Crew:</span> {job.assignedCrew}
            </div>
            {job.status === "in-progress" && (
              <div>
                <span className="font-medium">Day:</span> {job.currentDay} of {job.totalDays}
              </div>
            )}
          </div>

          {job.status === "in-progress" && !job.onSchedule && (
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 w-fit">
              <Clock className="mr-1 h-3 w-3" />
              Behind Schedule
            </Badge>
          )}

          <div className="flex justify-end gap-2 mt-2">
            {job.status === "scheduled" && (
              <>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
                <Button size="sm">Start Job</Button>
              </>
            )}
            {job.status === "in-progress" && (
              <>
                <Button size="sm" variant="outline">
                  Update Progress
                </Button>
                <Button size="sm">Complete Job</Button>
              </>
            )}
            {job.status === "completed" && (
              <Button size="sm" variant="outline">
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
