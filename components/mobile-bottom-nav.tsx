"use client"

import { Home, Users, Calendar, Package, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export function MobileBottomNav() {
  const pathname = usePathname()
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const quickActions = [
    { title: "New Lead", href: "/leads/new", icon: Users },
    { title: "New Estimate", href: "/estimates/new", icon: Package },
    { title: "Schedule Job", href: "/scheduling", icon: Calendar },
    { title: "Report Issue", href: "/nursery/issues/new", icon: Package },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200">
        <div className="grid grid-cols-5 h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive("/") ? "text-emerald-600 bg-emerald-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link
            href="/leads"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive("/leads") ||
              isActive("/consultations") ||
              isActive("/designs") ||
              isActive("/blue-sheets") ||
              isActive("/estimates")
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs font-medium">Sales</span>
          </Link>

          {/* Quick Actions Center Button */}
          <Sheet open={quickActionsOpen} onOpenChange={setQuickActionsOpen}>
            <SheetTrigger asChild>
              <Button
                size="sm"
                className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg mx-auto my-2"
              >
                <Plus className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      onClick={() => setQuickActionsOpen(false)}
                      className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <action.icon className="h-6 w-6 text-emerald-600" />
                      <span className="text-sm font-medium text-slate-900">{action.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/scheduling"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive("/scheduling") || isActive("/deliveries") || isActive("/installations") || isActive("/jobs")
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs font-medium">Field</span>
          </Link>

          <Link
            href="/calendar"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive("/calendar")
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs font-medium">Calendar</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding for mobile content */}
      <div className="lg:hidden h-16"></div>
    </>
  )
}
