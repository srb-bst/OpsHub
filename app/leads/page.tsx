"use client"

import { useSearchParams } from "next/navigation"
import { LeadManagement } from "@/components/lead-management"

export default function LeadsPage() {
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter")

  return <LeadManagement initialFilter={filter} />
}
