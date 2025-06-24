"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <Badge className="fixed top-4 right-4 bg-red-500 hover:bg-red-500 text-white px-4 py-2 rounded-xl z-50">
      <WifiOff className="mr-2 h-4 w-4" />
      Offline Mode
    </Badge>
  )
}
