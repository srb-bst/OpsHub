"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Edit,
  Camera,
  MessageSquare,
  Clock,
  User,
  MapPin,
  Calendar,
  Tag,
  AlertTriangle,
  Plus,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NurseryIssueDetailProps {
  issueId: string
}

export function NurseryIssueDetail({ issueId }: NurseryIssueDetailProps) {
  const [newComment, setNewComment] = useState("")
  const [status, setStatus] = useState("Open")

  // Mock data - in real app this would come from API
  const issue = {
    id: issueId,
    title: "Aphid infestation on Japanese Maples",
    description:
      "Large aphid colony found on multiple Japanese Maple trees in Block A, Row 3. The infestation appears to be spreading rapidly and affecting the health of the trees. Leaves are showing signs of yellowing and curling. Immediate treatment is required to prevent further spread to adjacent plants.",
    type: "Pest Control",
    priority: "High",
    status: "Open",
    location: "Block A - Row 3",
    assignedTo: "Mike Johnson",
    createdBy: "Sarah Wilson",
    createdAt: "June 17, 2025 at 2:30 PM",
    updatedAt: "June 17, 2025 at 3:45 PM",
    dueDate: "June 20, 2025",
    tags: ["aphids", "japanese-maple", "urgent", "pest-control"],
    photos: [
      {
        id: 1,
        url: "/placeholder.svg?height=300&width=400&text=Aphid+Colony",
        caption: "Close-up of aphid colony on leaf underside",
        uploadedBy: "Sarah Wilson",
        uploadedAt: "2 hours ago",
      },
      {
        id: 2,
        url: "/placeholder.svg?height=300&width=400&text=Affected+Leaves",
        caption: "Yellowing and curling leaves showing damage",
        uploadedBy: "Sarah Wilson",
        uploadedAt: "2 hours ago",
      },
      {
        id: 3,
        url: "/placeholder.svg?height=300&width=400&text=Tree+Overview",
        caption: "Overall view of affected Japanese Maple",
        uploadedBy: "Mike Johnson",
        uploadedAt: "1 hour ago",
      },
    ],
    comments: [
      {
        id: 1,
        author: "Mike Johnson",
        content: "I've inspected the trees and confirmed the aphid infestation. Will start treatment tomorrow morning.",
        timestamp: "1 hour ago",
        type: "comment",
      },
      {
        id: 2,
        author: "Sarah Wilson",
        content: "Status changed from Open to In Progress",
        timestamp: "45 minutes ago",
        type: "status_change",
      },
      {
        id: 3,
        author: "Tom Davis",
        content:
          "I recommend using insecticidal soap first, then neem oil if needed. Avoid harsh chemicals near the pond.",
        timestamp: "30 minutes ago",
        type: "comment",
      },
    ],
    relatedIssues: [
      { id: "2", title: "Yellowing leaves on nearby Hostas", status: "Open" },
      { id: "5", title: "General pest inspection needed", status: "Resolved" },
    ],
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // Here you would update the database
    console.log(`Status changed to: ${newStatus}`)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Here you would save the comment to database
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Link href="/nursery/issues">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{issue.title}</h1>
            <p className="text-slate-600 mt-1">
              Issue #{issue.id} • Created by {issue.createdBy}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor(issue.priority)} variant="outline">
            {issue.priority}
          </Badge>
          <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{issue.description}</p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="photos">Photos ({issue.photos.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity ({issue.comments.length})</TabsTrigger>
              <TabsTrigger value="related">Related Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="mt-6">
              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Photo Documentation</CardTitle>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {issue.photos.map((photo) => (
                      <div key={photo.id} className="space-y-2">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.caption}
                          className="w-full h-48 object-cover rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-900">{photo.caption}</p>
                          <p className="text-xs text-slate-500">
                            By {photo.uploadedBy} • {photo.uploadedAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {issue.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 border border-slate-200 rounded-lg">
                        <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          {comment.type === "status_change" ? (
                            <AlertTriangle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">{comment.author}</span>
                            <span className="text-xs text-slate-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-slate-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="related" className="mt-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Related Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {issue.relatedIssues.map((relatedIssue) => (
                      <div
                        key={relatedIssue.id}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        <Link
                          href={`/nursery/issues/${relatedIssue.id}`}
                          className="font-medium text-slate-900 hover:text-emerald-600"
                        >
                          {relatedIssue.title}
                        </Link>
                        <Badge className={getStatusColor(relatedIssue.status)}>{relatedIssue.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Issue
              </Button>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
            </CardContent>
          </Card>

          {/* Issue Details */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Location</div>
                  <div className="text-sm text-slate-600">{issue.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Assigned To</div>
                  <div className="text-sm text-slate-600">{issue.assignedTo}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Due Date</div>
                  <div className="text-sm text-slate-600">{issue.dueDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Created</div>
                  <div className="text-sm text-slate-600">{issue.createdAt}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Last Updated</div>
                  <div className="text-sm text-slate-600">{issue.updatedAt}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {issue.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
