"use client"

import { CheckCircle2, CircleDashed, ClipboardList, Filter, Plus, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DesignList() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search designs..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/designs/new">
              <Plus className="mr-2 h-4 w-4" />
              New Design
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Designs</TabsTrigger>
          <TabsTrigger value="needs-estimate">Needs Estimate</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Design Projects</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <DesignCard
                title="Taylor Residence"
                customer="Taylor, John & Mary"
                address="123 Oak St, Springfield"
                type="Residential"
                area="Front Yard"
                status="needs-estimate"
                lastUpdated="2 hours ago"
              />
              <DesignCard
                title="Riverside Cafe"
                customer="Riverside Cafe LLC"
                address="456 River Rd, Springfield"
                type="Commercial"
                area="Outdoor Seating"
                status="pending-approval"
                lastUpdated="Yesterday"
              />
              <DesignCard
                title="Mountain View HOA"
                customer="Mountain View HOA"
                address="789 Mountain View Dr, Springfield"
                type="Commercial"
                area="Common Areas"
                status="approved"
                lastUpdated="3 days ago"
              />
              <DesignCard
                title="Anderson Backyard Design"
                customer="Anderson, Lisa"
                address="666 Forest Rd, Springfield"
                type="Residential"
                area="Back Yard"
                status="needs-estimate"
                lastUpdated="1 day ago"
              />
              <DesignCard
                title="Martinez Patio Design"
                customer="Martinez, Miguel"
                address="555 Sunset Blvd, Springfield"
                type="Residential"
                area="Patio"
                status="needs-estimate"
                lastUpdated="4 days ago"
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="needs-estimate" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Designs Needing Estimates</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <DesignCard
                title="Taylor Residence"
                customer="Taylor, John & Mary"
                address="123 Oak St, Springfield"
                type="Residential"
                area="Front Yard"
                status="needs-estimate"
                lastUpdated="2 hours ago"
              />
              <DesignCard
                title="Anderson Backyard Design"
                customer="Anderson, Lisa"
                address="666 Forest Rd, Springfield"
                type="Residential"
                area="Back Yard"
                status="needs-estimate"
                lastUpdated="1 day ago"
              />
              <DesignCard
                title="Martinez Patio Design"
                customer="Martinez, Miguel"
                address="555 Sunset Blvd, Springfield"
                type="Residential"
                area="Patio"
                status="needs-estimate"
                lastUpdated="4 days ago"
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="pending-approval" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Designs Pending Approval</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <DesignCard
                title="Riverside Cafe"
                customer="Riverside Cafe LLC"
                address="456 River Rd, Springfield"
                type="Commercial"
                area="Outdoor Seating"
                status="pending-approval"
                lastUpdated="Yesterday"
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Approved Designs</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              <DesignCard
                title="Mountain View HOA"
                customer="Mountain View HOA"
                address="789 Mountain View Dr, Springfield"
                type="Commercial"
                area="Common Areas"
                status="approved"
                lastUpdated="3 days ago"
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DesignCardProps {
  title: string
  customer: string
  address: string
  type: string
  area: string
  status: "needs-estimate" | "pending-approval" | "approved"
  lastUpdated: string
}

function DesignCard({ title, customer, address, type, area, status, lastUpdated }: DesignCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {status === "needs-estimate" && (
            <Badge>
              <CircleDashed className="mr-1 h-3 w-3" />
              Needs Estimate
            </Badge>
          )}
          {status === "pending-approval" && (
            <Badge variant="outline">
              <ClipboardList className="mr-1 h-3 w-3" />
              Pending Approval
            </Badge>
          )}
          {status === "approved" && (
            <Badge variant="secondary">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Approved
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm">
            <span className="font-medium">Customer:</span> {customer}
          </div>
          <div className="text-sm text-muted-foreground">{address}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Type:</span> {type}
            </div>
            <div>
              <span className="font-medium">Area:</span> {area}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Last updated {lastUpdated}</div>
          <div className="flex justify-end gap-2 mt-2">
            {status === "needs-estimate" && <Button size="sm">Create Estimate</Button>}
            {status === "pending-approval" && (
              <Button size="sm" variant="outline">
                Check Status
              </Button>
            )}
            {status === "approved" && <Button size="sm">Schedule Job</Button>}
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
