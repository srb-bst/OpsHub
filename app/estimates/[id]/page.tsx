import { use } from "react"
import { EstimateDetail } from "@/components/estimate-detail"

interface EstimateDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EstimateDetailPage({ params }: EstimateDetailPageProps) {
  const { id } = use(params)
  return <EstimateDetail estimateId={id} />
}
