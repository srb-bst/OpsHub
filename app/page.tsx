import { DashboardView } from "@/components/dashboard-view"
import { InstallPrompt } from "@/components/install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function Home() {
  return (
    <>
      <DashboardView />
      <InstallPrompt />
      <OfflineIndicator />
    </>
  )
}
