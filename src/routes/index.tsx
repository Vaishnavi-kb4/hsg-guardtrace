import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { WorkerDashboard } from "@/components/h2s/WorkerDashboard";
import { SafetyMonitorDashboard } from "@/components/h2s/SafetyMonitorDashboard";
import { AuthGatewayView } from "@/components/h2s/AuthGatewayView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "H₂S Guard — Passive Exposure Monitoring System" },
      { name: "description", content: "Industrial H₂S Passive Exposure Dosimeter system interface." },
    ],
  }),
  component: MainGatewayPage,
});

function MainGatewayPage() {
  const { currentUser } = useApp();

  // 1. IF NOT LOGGED IN: Render Login Page Gateway (no dashboard details shown!)
  if (!currentUser) {
    return <AuthGatewayView />;
  }

  // 2. IF LOGGED IN AS FIELD WORKER: Render dedicated Worker Dashboard (full screen on laptop/desktop)
  if (currentUser.role === "worker") {
    return <WorkerDashboard />;
  }

  // 3. IF LOGGED IN AS HSE OFFICER: Render dedicated HSE Safety Monitor Web Dashboard (looking exactly as specified)
  return <SafetyMonitorDashboard />;
}
