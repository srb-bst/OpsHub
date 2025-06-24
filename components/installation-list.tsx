"use client"

import { CalendarDays, CheckCircle2, CircleDashed, Filter, Plus, Search, Truck } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InstallationList() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search installations..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="#">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Installation
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Upcoming Installations</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="trees">Trees</SelectItem>
                <SelectItem value="shrubs">Shrubs</SelectItem>
                <SelectItem value="planters">Planters</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <InstallationCard
                customer="Johnson Residence"
                address="123 Oak St, Springfield"
                date="Today, 10:30 AM"
                type="Trees"
                status="in-progress"
                items="2 Maple Trees, 1 Oak Tree"
              />
              <InstallationCard
                customer="Davis Residence"
                address="222 Elm St, Springfield"
                date="Jun 20, 9:00 AM"
                type="Shrubs"
                status="scheduled"
                items="5 Boxwood Shrubs, 3 Hydrangeas"
              />
              <InstallationCard
                customer="Downtown Office"
                address="555 Main St, Springfield"
                date="Jun 22, 1:00 PM"
                type="Planters"
                status="scheduled"
                items="8 Large Concrete Planters with Mixed Annuals"
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Completed Installations</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="trees">Trees</SelectItem>
                <SelectItem value="shrubs">Shrubs</SelectItem>
                <SelectItem value="planters">Planters</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <InstallationCard
                customer="Wilson Estate"
                address="444 Aspen Ln, Springfield"
                date="Jun 15, 11:00 AM"
                type="Mixed"
                status="completed"
                items="3 Evergreen Trees, 12 Assorted Shrubs"
              />
              <InstallationCard
                customer="Garcia Property"
                address="333 Birch Ave, Springfield"
                date="Jun 14, 2:00 PM"
                type="Trees"
                status="completed"
                items="4 Fruit Trees"
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface InstallationCardProps {
  customer: string
  address: string
  date: string
  type: string
  status: "scheduled" | "in-progress" | "completed"
  items: string
}

function InstallationCard({ customer, address, date, type, status, items }: InstallationCardProps) {
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">{address}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Truck className="mr-1 h-3 w-3" />
              {type}
            </Badge>
            <div className="text-sm font-medium">{date}</div>
          </div>
          <div className="text-sm">
            <span className="font-medium">Items:</span> {items}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            {status === "scheduled" && (
              <>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
                <Button size="sm">Start Installation</Button>
              </>
            )}
            {status === "in-progress" && <Button size="sm">Complete Installation</Button>}
            {status === "completed" && (
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
