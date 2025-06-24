"use client"

import { useSearchParams } from "next/navigation"
import { JobScheduling } from "@/components/job-scheduling"

export default function SchedulingPage() {
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter")

  return <JobScheduling initialFilter={filter} />
}
