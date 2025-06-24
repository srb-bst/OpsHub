import { BlueSheetDetail } from "@/components/blue-sheet-detail"

export default function BlueSheetDetailPage({ params }: { params: { id: string } }) {
  return <BlueSheetDetail blueSheetId={params.id} />
}
