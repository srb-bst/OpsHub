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
  FileText,
  CalendarCheck,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Package,
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
  const [designsOpen, setDesignsOpen] = useState(true)
  const [fieldOpsOpen, setFieldOpsOpen] = useState(true)
  const [nurseryOpen, setNurseryOpen] = useState(false)

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
            <h1 className="text-lg font-semibold text-slate-900">GreenScape</h1>
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

              {/* Designs & Estimates - Process Flow Order */}
              <SidebarMenuItem>
                <Collapsible open={designsOpen} onOpenChange={setDesignsOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <ClipboardList className="h-5 w-5" />
                        <span>Designs & Estimates</span>
                      </div>
                      {designsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                      isActive={isActive("/consultations")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/consultations">
                        <Shovel className="h-4 w-4" />
                        <span>Consultations</span>
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
                      isActive={isActive("/blue-sheets")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/blue-sheets">
                        <FileText className="h-4 w-4" />
                        <span>Blue Sheets</span>
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

              {/* Field Operations - Process Flow Order */}
              <SidebarMenuItem>
                <Collapsible open={fieldOpsOpen} onOpenChange={setFieldOpsOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <Shovel className="h-5 w-5" />
                        <span>Field Operations</span>
                      </div>
                      {fieldOpsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                      isActive={isActive("/deliveries")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/deliveries">
                        <Package className="h-4 w-4" />
                        <span>Deliveries</span>
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
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Nursery Management */}
              <SidebarMenuItem>
                <Collapsible open={nurseryOpen} onOpenChange={setNurseryOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-12 text-base font-medium rounded-lg hover:bg-slate-50 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <Leaf className="h-5 w-5" />
                        <span>Nursery Management</span>
                      </div>
                      {nurseryOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 mt-2 space-y-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/nursery")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/nursery">
                        <Leaf className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive("/nursery/issues")}
                      className="h-10 text-sm font-medium rounded-lg hover:bg-slate-50 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/nursery/issues">
                        <FileText className="h-4 w-4" />
                        <span>Issue Tracker</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleContent>
                </Collapsible>
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
          <Link href="/estimates/new">
            <span>New Estimate</span>
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
