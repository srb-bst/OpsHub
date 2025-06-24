"use client"

import { Filter, Plus, Search, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CustomerList() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search customers..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="#">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">All Customers</h2>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="active">Active Projects</SelectItem>
            <SelectItem value="completed">Completed Projects</SelectItem>
            <SelectItem value="new">New Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          <CustomerCard
            name="Johnson, Robert & Sarah"
            address="123 Oak St, Springfield"
            phone="(555) 123-4567"
            email="johnson@example.com"
            status="active"
            projects={2}
          />
          <CustomerCard
            name="Williams, James"
            address="101 Cedar Ln, Springfield"
            phone="(555) 234-5678"
            email="williams@example.com"
            status="active"
            projects={1}
          />
          <CustomerCard
            name="Thompson, Emily"
            address="456 Maple Dr, Springfield"
            phone="(555) 345-6789"
            email="thompson@example.com"
            status="new"
            projects={0}
          />
          <CustomerCard
            name="Davis, Michael & Jennifer"
            address="222 Elm St, Springfield"
            phone="(555) 456-7890"
            email="davis@example.com"
            status="completed"
            projects={3}
          />
          <CustomerCard
            name="Garcia, Carlos"
            address="333 Birch Ave, Springfield"
            phone="(555) 567-8901"
            email="garcia@example.com"
            status="active"
            projects={1}
          />
          <CustomerCard
            name="Wilson, Thomas"
            address="444 Aspen Ln, Springfield"
            phone="(555) 678-9012"
            email="wilson@example.com"
            status="completed"
            projects={2}
          />
          <CustomerCard
            name="Anderson, Lisa"
            address="666 Forest Rd, Springfield"
            phone="(555) 789-0123"
            email="anderson@example.com"
            status="new"
            projects={1}
          />
          <CustomerCard
            name="Miller, David"
            address="789 Pine Rd, Springfield"
            phone="(555) 890-1234"
            email="miller@example.com"
            status="active"
            projects={1}
          />
        </div>
      </ScrollArea>
    </div>
  )
}

interface CustomerCardProps {
  name: string
  address: string
  phone: string
  email: string
  status: "active" | "completed" | "new"
  projects: number
}

function CustomerCard({ name, address, phone, email, status, projects }: CustomerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            {name}
          </CardTitle>
          {status === "active" && <Badge className="bg-green-600">Active</Badge>}
          {status === "completed" && <Badge variant="outline">Completed</Badge>}
          {status === "new" && <Badge className="bg-blue-600">New</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">{address}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>{phone}</div>
            <div>{email}</div>
          </div>
          <div className="text-sm mt-1">
            <span className="font-medium">Projects:</span> {projects}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button size="sm" variant="outline">
              View History
            </Button>
            <Button size="sm">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
