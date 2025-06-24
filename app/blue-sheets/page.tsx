"use client"

import { Suspense } from "react"
import { BlueSheetList } from "@/components/blue-sheet-list"

function BlueSheetsContent() {
  return <BlueSheetList />
}

export default function BlueSheetsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlueSheetsContent />
    </Suspense>
  )
}
