"use client"

import { CalendarDays, CheckCircle2, CircleDashed, Clock, Filter, Plus, Search, Shovel } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConsultationList() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search consultations..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="#">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="needs-scheduling">Needs Scheduling</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Upcoming Consultations</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="initial">Initial Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="measurement">Measurement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <ConsultationCard
                customer="Johnson Residence"
                address="123 Oak St, Springfield"
                date="Today, 8:00 AM"
                type="Initial Consultation"
                status="scheduled"
                designProject="Front Yard Redesign"
              />
              <ConsultationCard
                customer="Williams Property"
                address="101 Cedar Ln, Springfield"
                date="Today, 3:30 PM"
                type="Follow-up"
                status="scheduled"
                designProject="Backyard Renovation"
              />
              <ConsultationCard
                customer="Thompson Garden"
                address="456 Maple Dr, Springfield"
                date="Tomorrow, 10:00 AM"
                type="Measurement"
                status="scheduled"
                designProject="Full Property Landscaping"
              />
              <ConsultationCard
                customer="Miller Residence"
                address="789 Pine Rd, Springfield"
                date="Jun 21, 1:00 PM"
                type="Initial Consultation"
                status="scheduled"
                designProject="Garden Redesign"
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Completed Consultations</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="initial">Initial Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="measurement">Measurement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <ConsultationCard
                customer="Davis Residence"
                address="222 Elm St, Springfield"
                date="Jun 15, 9:00 AM"
                type="Initial Consultation"
                status="completed"
                designProject="Front Yard Redesign"
              />
              <ConsultationCard
                customer="Garcia Property"
                address="333 Birch Ave, Springfield"
                date="Jun 14, 2:00 PM"
                type="Measurement"
                status="completed"
                designProject="Backyard Renovation"
              />
              <ConsultationCard
                customer="Wilson Estate"
                address="444 Aspen Ln, Springfield"
                date="Jun 12, 11:00 AM"
                type="Follow-up"
                status="completed"
                designProject="Full Property Landscaping"
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="needs-scheduling" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Needs Scheduling</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="initial">Initial Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="measurement">Measurement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <ConsultationCard
                customer="Lakeside Property"
                address="555 Shore Dr, Springfield"
                date="Needs Scheduling"
                type="Initial Consultation"
                status="needs-scheduling"
                designProject="Waterfront Landscaping"
              />
              <ConsultationCard
                customer="Anderson Residence"
                address="666 Forest Rd, Springfield"
                date="Needs Scheduling"
                type="Measurement"
                status="needs-scheduling"
                designProject="Backyard Design"
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ConsultationCardProps {
  customer: string
  address: string
  date: string
  type: string
  status: "scheduled" | "in-progress" | "completed" | "needs-scheduling"
  designProject: string
}

function ConsultationCard({ customer, address, date, type, status, designProject }: ConsultationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{customer}</CardTitle>
          {status === "scheduled" && (
            <Badge variant="secondary">
              <CalendarDays className="mr-1 h-3 w-3" />
              Scheduled
            </Badge>
          )}
          {status === "in-progress" && (
            <Badge className="bg-amber-500">
              <CircleDashed className="mr-1 h-3 w-3" />
              In Progress
            </Badge>
          )}
          {status === "completed" && (
            <Badge className="bg-green-600">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completed
            </Badge>
          )}
          {status === "needs-scheduling" && (
            <Badge variant="destructive">
              <Clock className="mr-1 h-3 w-3" />
              Needs Scheduling
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">{address}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Shovel className="mr-1 h-3 w-3" />
              {type}
            </Badge>
            <div className="text-sm font-medium">{status !== "needs-scheduling" ? date : ""}</div>
          </div>
          <div className="text-sm">
            <span className="font-medium">Design Project:</span> {designProject}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {status === "needs-scheduling" && <Button size="sm">Schedule</Button>}
            {status === "scheduled" && (
              <>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
                <Button size="sm">Start Consultation</Button>
              </>
            )}
            {status === "completed" && (
              <Button size="sm" variant="outline">
                View Notes
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
