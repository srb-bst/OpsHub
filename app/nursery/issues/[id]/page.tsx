import { NurseryIssueDetail } from "@/components/nursery-issue-detail"

export default function NurseryIssueDetailPage({ params }: { params: { id: string } }) {
  return <NurseryIssueDetail issueId={params.id} />
}
