"use client"

import { useState, useEffect } from "react"
import { Search, X, FileText, Users, Calendar, Package, DollarSign, Leaf } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SearchResult {
  id: string
  title: string
  subtitle: string
  type: "lead" | "customer" | "project" | "estimate" | "delivery" | "issue"
  href: string
  status?: string
  priority?: string
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Sarah Johnson",
    subtitle: "123 Oak Street, Springfield",
    type: "lead",
    href: "/leads",
    status: "new",
    priority: "high",
  },
  {
    id: "2",
    title: "Garcia Backyard Renovation",
    subtitle: "Blue Sheet - Ready for estimate",
    type: "project",
    href: "/blue-sheets/2",
    status: "ready-for-estimate",
  },
  {
    id: "3",
    title: "EST-2025-001",
    subtitle: "Sarah Johnson - $15,500",
    type: "estimate",
    href: "/estimates/1",
    status: "sent-to-customer",
  },
  {
    id: "4",
    title: "Japanese Maple Delivery",
    subtitle: "DEL-001 - Scheduled for today",
    type: "delivery",
    href: "/deliveries",
    status: "scheduled",
  },
  {
    id: "5",
    title: "Aphid infestation",
    subtitle: "Block A - Japanese Maples",
    type: "issue",
    href: "/nursery/issues/1",
    status: "open",
    priority: "high",
  },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = mockSearchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [searchTerm])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lead":
        return <Users className="h-4 w-4 text-blue-600" />
      case "customer":
        return <Users className="h-4 w-4 text-green-600" />
      case "project":
        return <FileText className="h-4 w-4 text-purple-600" />
      case "estimate":
        return <DollarSign className="h-4 w-4 text-emerald-600" />
      case "delivery":
        return <Package className="h-4 w-4 text-orange-600" />
      case "issue":
        return <Leaf className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "open":
        return "bg-red-100 text-red-800"
      case "scheduled":
      case "ready-for-estimate":
        return "bg-blue-100 text-blue-800"
      case "sent-to-customer":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative w-full lg:w-80 h-10 justify-start text-sm text-muted-foreground bg-white/80 backdrop-blur-sm border-slate-200"
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search everything...</span>
          <span className="lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search leads, projects, estimates, deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-12 text-base border-0 focus-visible:ring-0 bg-slate-50"
              autoFocus
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto p-4 pt-0">
          {searchTerm.length > 1 && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No results found for "{searchTerm}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((result) => (
                <Link key={result.id} href={result.href} onClick={() => setOpen(false)} className="block">
                  <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">{getTypeIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-900 truncate">{result.title}</p>
                            {result.priority === "high" && (
                              <div className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{result.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {result.status && (
                            <Badge
                              className={`${getStatusColor(result.status)} text-xs px-2 py-1 rounded-md font-medium border-0`}
                            >
                              {result.status.replace("-", " ")}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {result.type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {searchTerm.length <= 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Quick Access</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/leads/new" onClick={() => setOpen(false)}>
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                      <CardContent className="p-3 text-center">
                        <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">New Lead</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/estimates/new" onClick={() => setOpen(false)}>
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                      <CardContent className="p-3 text-center">
                        <DollarSign className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">New Estimate</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/scheduling" onClick={() => setOpen(false)}>
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                      <CardContent className="p-3 text-center">
                        <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">Schedule Job</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/nursery/issues/new" onClick={() => setOpen(false)}>
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                      <CardContent className="p-3 text-center">
                        <Leaf className="h-6 w-6 text-red-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">Report Issue</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
