import { ConsultationList } from "@/components/consultation-list"

export default function ConsultationsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Consultations</h1>
      <ConsultationList />
    </div>
  )
}
