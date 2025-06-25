"use client"

import {
  Calendar,
  ClipboardList,
  Home,
  Leaf,
  Menu,
  Shovel,
  Truck,
  Users,
  UserPlus,
  CalendarCheck,
  DollarSign,
  ChevronDown,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function AppSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [salesOpen, setSalesOpen] = useState(true)
  const [operationsOpen, setOperationsOpen] = useState(true)
  const [resourcesOpen, setResourcesOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const SidebarContent = () => (
    <>
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Faulkner's Hub</h1>
            <p className="text-sm text-slate-500">Professional</p>
          </div>
        </div>
      </SidebarHeader>
      <div className="p-4 flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/")}
                  className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 data-[active=true]:border"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Sales Pipeline */}
              <SidebarMenuItem>
                <Collapsible open={salesOpen} onOpenChange={setSalesOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <UserPlus className="h-5 w-5" />
                        <span>Sales Pipeline</span>
                      </div>
                      {salesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-2 space-y-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/leads")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/leads">
                        <UserPlus className="h-4 w-4" />
                        <span>Leads</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/designs")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/designs">
                        <ClipboardList className="h-4 w-4" />
                        <span>Design Projects</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/estimates")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/estimates">
                        <DollarSign className="h-4 w-4" />
                        <span>Estimates</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Operations */}
              <SidebarMenuItem>
                <Collapsible open={operationsOpen} onOpenChange={setOperationsOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <Shovel className="h-5 w-5" />
                        <span>Operations</span>
                      </div>
                      {operationsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-2 space-y-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/scheduling")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/scheduling">
                        <CalendarCheck className="h-4 w-4" />
                        <span>Job Scheduling</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/installations")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/installations">
                        <Truck className="h-4 w-4" />
                        <span>Installations</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/jobs")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/jobs">
                        <Shovel className="h-4 w-4" />
                        <span>Active Jobs</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/operations/crew")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/operations/crew">
                        <Users className="h-4 w-4" />
                        <span>Crew Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Resources */}
              <SidebarMenuItem>
                <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5" />
                        <span>Resources</span>
                      </div>
                      {resourcesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-2 space-y-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/resources/assignments")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/resources/assignments">
                        <Users className="h-4 w-4" />
                        <span>Design Assignments</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/resources/overview")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/resources/overview">
                        <BarChart3 className="h-4 w-4" />
                        <span>Lead Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Nursery Management */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/nursery")}
                  className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 data-[active=true]:border"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/nursery">
                    <Leaf className="h-5 w-5" />
                    <span>Nursery</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Calendar */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/calendar")}
                  className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 data-[active=true]:border"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/calendar">
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Customers */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/customers")}
                  className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:border-emerald-200 data-[active=true]:border"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/customers">
                    <Users className="h-5 w-5" />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
      <div className="p-4 border-t border-slate-100">
        <Button
          asChild
          size="sm"
          className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none"
          onClick={() => setOpen(false)}
        >
          <Link href="/designs/new">
            <span>New Design Project</span>
          </Link>
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200/60">
          <SidebarContent />
        </Sidebar>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-4 left-4 z-50 h-10 w-10 p-0 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg shadow-sm"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
