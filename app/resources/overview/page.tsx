import { LeadOverview } from "@/components/lead-overview"

export default function LeadOverviewPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Lead Overview by Assignee</h1>
      <LeadOverview />
    </div>
  )
}
