"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, X, Camera, MapPin, User, Calendar, Tag, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NewNurseryIssue() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "",
    location: "",
    assignedTo: "",
    dueDate: "",
    tags: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally save to database
    console.log("Creating issue:", formData, uploadedFiles)

    // Show success message
    alert(`Issue "${formData.title}" has been created successfully!`)

    // Redirect to issues list
    router.push("/nursery/issues")
  }

  const isFormValid = formData.title && formData.description && formData.type && formData.priority && formData.location

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Link href="/nursery/issues">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Report New Issue</h1>
          <p className="text-slate-600 mt-1">Document a new nursery issue or maintenance task</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of the issue, symptoms, and any relevant information"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Issue Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pest Control">Pest Control</SelectItem>
                        <SelectItem value="Disease">Disease</SelectItem>
                        <SelectItem value="Plant Health">Plant Health</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Irrigation">Irrigation</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Inventory">Inventory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Assignment & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Block A - Row 1">Block A - Row 1</SelectItem>
                      <SelectItem value="Block A - Row 2">Block A - Row 2</SelectItem>
                      <SelectItem value="Block A - Row 3">Block A - Row 3</SelectItem>
                      <SelectItem value="Block B - Main Line">Block B - Main Line</SelectItem>
                      <SelectItem value="Block B - Row 1">Block B - Row 1</SelectItem>
                      <SelectItem value="Block B - Row 2">Block B - Row 2</SelectItem>
                      <SelectItem value="Block C - Shade Area">Block C - Shade Area</SelectItem>
                      <SelectItem value="Block C - Sun Area">Block C - Sun Area</SelectItem>
                      <SelectItem value="Block D - Rose Garden">Block D - Rose Garden</SelectItem>
                      <SelectItem value="Equipment Shed">Equipment Shed</SelectItem>
                      <SelectItem value="Greenhouse 1">Greenhouse 1</SelectItem>
                      <SelectItem value="Greenhouse 2">Greenhouse 2</SelectItem>
                      <SelectItem value="Office Area">Office Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                      <SelectItem value="Tom Davis">Tom Davis</SelectItem>
                      <SelectItem value="Lisa Chen">Lisa Chen</SelectItem>
                      <SelectItem value="Unassigned">Leave Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="Comma-separated tags (e.g., aphids, urgent, japanese-maple)"
                  />
                  <p className="text-xs text-slate-500">
                    Tags help categorize and search for issues. Separate multiple tags with commas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Photos */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Photo Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Photos</h3>
                  <p className="text-slate-500 mb-4">Drag and drop photos here, or click to select files</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Photos
                    </label>
                  </Button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-slate-900 mb-3">Uploaded Photos ({uploadedFiles.length})</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Preview */}
            {formData.title && (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-emerald-900">Issue Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-emerald-900">{formData.title}</h3>
                      {formData.description && (
                        <p className="text-sm text-emerald-800 mt-1 line-clamp-2">{formData.description}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.type && (
                        <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-800">
                          {formData.type}
                        </Badge>
                      )}
                      {formData.priority && (
                        <Badge
                          className={`text-xs ${
                            formData.priority === "Critical"
                              ? "bg-red-100 text-red-800"
                              : formData.priority === "High"
                                ? "bg-orange-100 text-orange-800"
                                : formData.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {formData.priority}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-emerald-700">
                      {formData.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {formData.location}
                        </div>
                      )}
                      {formData.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {formData.assignedTo}
                        </div>
                      )}
                      {formData.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formData.dueDate}
                        </div>
                      )}
                    </div>
                    {formData.tags && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.split(",").map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button type="button" variant="outline" asChild className="flex-1">
            <Link href="/nursery/issues">Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600" disabled={!isFormValid}>
            {!isFormValid && <AlertTriangle className="h-4 w-4 mr-2" />}
            Create Issue
          </Button>
        </div>
      </form>
    </div>
  )
}
