import { ComprehensiveDesignDetail } from "@/components/comprehensive-design-detail"

export default function DesignDetailPage({ params }: { params: { id: string } }) {
  return <ComprehensiveDesignDetail designId={params.id} />
}
