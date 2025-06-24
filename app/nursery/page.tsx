import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, Clock, CheckCircle, Camera, MapPin, User } from "lucide-react"
import Link from "next/link"

export default function NurseryDashboard() {
  const stats = [
    { label: "Open Issues", value: 12, color: "bg-red-500", icon: AlertTriangle },
    { label: "In Progress", value: 8, color: "bg-yellow-500", icon: Clock },
    { label: "Resolved Today", value: 5, color: "bg-green-500", icon: CheckCircle },
    { label: "Total This Week", value: 25, color: "bg-blue-500", icon: Camera },
  ]

  const recentIssues = [
    {
      id: 1,
      title: "Aphid infestation on Japanese Maples",
      type: "Pest Control",
      priority: "High",
      location: "Block A - Row 3",
      assignedTo: "Mike Johnson",
      status: "Open",
      createdAt: "2 hours ago",
      photos: 3,
    },
    {
      id: 2,
      title: "Irrigation system leak",
      type: "Equipment",
      priority: "Critical",
      location: "Block B - Main Line",
      assignedTo: "Sarah Wilson",
      status: "In Progress",
      createdAt: "4 hours ago",
      photos: 2,
    },
    {
      id: 3,
      title: "Yellowing leaves on Hostas",
      type: "Plant Health",
      priority: "Medium",
      location: "Block C - Shade Area",
      assignedTo: "Tom Davis",
      status: "Open",
      createdAt: "6 hours ago",
      photos: 4,
    },
    {
      id: 4,
      title: "Fertilizer spreader malfunction",
      type: "Equipment",
      priority: "Low",
      location: "Equipment Shed",
      assignedTo: "Mike Johnson",
      status: "Resolved",
      createdAt: "1 day ago",
      photos: 1,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Nursery Management</h1>
          <p className="text-slate-600 mt-1">Track and manage nursery issues, maintenance, and operations</p>
        </div>
        <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
          <Link href="/nursery/issues/new">
            <Plus className="h-4 w-4 mr-2" />
            Report Issue
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/nursery/issues/new">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm">Report Issue</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/nursery/issues">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">View All Issues</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/nursery/maintenance">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Maintenance Log</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/nursery/inventory">
                <Camera className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Inventory Check</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Issues */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Issues</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/nursery/issues">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div
                key={issue.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 mb-1">{issue.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                          <Badge variant="outline" className="text-xs">
                            {issue.type}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {issue.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {issue.assignedTo}
                          </div>
                          <div className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            {issue.photos} photos
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(issue.priority)} variant="outline">
                      {issue.priority}
                    </Badge>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{issue.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
