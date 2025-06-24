"use client"

import { useSearchParams } from "next/navigation"
import { BlueSheetList } from "@/components/blue-sheet-list"

export default function BlueSheetsPage() {
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter")

  return <BlueSheetList initialFilter={filter} />
}
