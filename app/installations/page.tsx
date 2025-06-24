import { InstallationList } from "@/components/installation-list"

export default function InstallationsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Installations</h1>
      <InstallationList />
    </div>
  )
}
