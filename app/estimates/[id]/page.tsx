"use client"

import { EstimateDetail } from "@/components/estimate-detail"

interface EstimateDetailPageProps {
  params: {
    id: string
  }
}

export default function EstimateDetailPage({ params }: EstimateDetailPageProps) {
  return <EstimateDetail estimateId={params.id} />
}
