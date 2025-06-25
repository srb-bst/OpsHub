import { EstimateList } from "@/components/estimate-list"

export default function EstimatesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Estimates</h1>
        <p className="text-slate-600 mt-2">Manage project estimates and pricing</p>
      </div>
      <EstimateList />
    </div>
  )
}
