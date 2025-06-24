"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { BlueSheetList } from "@/components/blue-sheet-list"

function BlueSheetsContent() {
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter")

  return <BlueSheetList initialFilter={filter} />
}

export default function BlueSheetsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      <BlueSheetsContent />
    </Suspense>
  )
}
