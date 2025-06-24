"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { JobScheduling } from "@/components/job-scheduling"

function SchedulingContent() {
  const searchParams = useSearchParams()
  const filter = searchParams.get("filter")

  return <JobScheduling initialFilter={filter} />
}

export default function SchedulingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulingContent />
    </Suspense>
  )
}
