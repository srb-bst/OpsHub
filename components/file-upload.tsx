"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, type File, Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FileUploadProps {
  onFileUpload?: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  label?: string
  description?: string
}

export function FileUpload({
  onFileUpload,
  acceptedTypes = [".pdf"],
  maxSize = 10,
  label = "Upload Document",
  description = "Drag and drop or click to select a PDF file",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = async (file: File) => {
    setErrorMessage("")

    // Validate file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    if (!acceptedTypes.includes(fileExtension)) {
      setErrorMessage(`Please select a ${acceptedTypes.join(", ")} file`)
      setUploadStatus("error")
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setErrorMessage(`File size must be less than ${maxSize}MB`)
      setUploadStatus("error")
      return
    }

    // Simulate upload
    setUploadStatus("uploading")

    try {
      // In a real app, you would upload to your server/cloud storage here
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setUploadStatus("success")
      onFileUpload?.(file)

      // Reset after success
      setTimeout(() => {
        setUploadStatus("idle")
      }, 2000)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Upload failed. Please try again.")
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const getStatusColor = () => {
    switch (uploadStatus) {
      case "uploading":
        return "border-blue-300 bg-blue-50"
      case "success":
        return "border-green-300 bg-green-50"
      case "error":
        return "border-red-300 bg-red-50"
      default:
        return isDragging ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
    }
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      case "success":
        return <Check className="h-8 w-8 text-green-600" />
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-600" />
      default:
        return <Upload className="h-8 w-8 text-slate-400" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Uploading..."
      case "success":
        return "Upload successful!"
      case "error":
        return errorMessage || "Upload failed"
      default:
        return description
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0">
              {acceptedTypes.join(", ")} • Max {maxSize}MB
            </Badge>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${getStatusColor()}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(",")}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center space-y-3">
              {getStatusIcon()}

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {uploadStatus === "idle" ? "Click to upload or drag and drop" : getStatusText()}
                </p>
                {uploadStatus === "idle" && <p className="text-xs text-slate-500 mt-1">{description}</p>}
              </div>

              {uploadStatus === "idle" && (
                <Button
                  type="button"
                  size="sm"
                  className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                >
                  Select File
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
