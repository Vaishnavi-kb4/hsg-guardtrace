import { createFileRoute } from "@tanstack/react-router";
import { Clock, Calendar, Users, HardHat, CheckCircle2, Boxes } from "lucide-react";
import { PageHeader, Panel, PanelHeader, MetricCard, StatusBadge } from "@/components/h2s/common";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RegisterWorkerWizard } from "@/components/h2s/RegisterWorkerWizard";

export const Route = createFileRoute("/shifts")({
  head: () => ({
    meta: [
      { title: "Shifts — H₂S GUARD" },
      { name: "description", content: "Plant shift schedule, active worker assignments, and dosimeter badge bindings." },
    ],
  }),
  component: ShiftsPage,
});

function ShiftsPage() {
  const { workers, registeredUsers } = useApp();
  const [regWizardOpen, setRegWizardOpen] = useState(false);

  const activeWorkerList = registeredUsers.length > 0
    ? registeredUsers.filter((u) => u.role === "worker")
    : workers;

  const shiftGroups = [
    {
      id: "SHIFT-MORNING",
      name: "Morning Shift",
      time: "06:00 AM – 02:00 PM",
      workers: activeWorkerList.filter((w) => w.shift.toLowerCase().includes("morning")),
    },
    {
      id: "SHIFT-GENERAL",
      name: "General Shift",
      time: "09:00 AM – 05:00 PM",
      workers: activeWorkerList.filter((w) => w.shift.toLowerCase().includes("general")),
    },
    {
      id: "SHIFT-EVENING",
      name: "Evening Shift",
      time: "02:00 PM – 10:00 PM",
      workers: activeWorkerList.filter((w) => w.shift.toLowerCase().includes("evening")),
    },
    {
      id: "SHIFT-NIGHT",
      name: "Night Shift",
      time: "10:00 PM – 06:00 AM",
      workers: activeWorkerList.filter((w) => w.shift.toLowerCase().includes("night")),
    },
  ];

  return (
    <>
      <PageHeader
        title="Plant Shift Schedule & Assignments"
        subtitle="HSE Officer control: Manage active shifts, assigned workers, and dosimeter badge bindings."
        action={
          <Button
            size="sm"
            onClick={() => setRegWizardOpen(true)}
            className="gap-1.5 font-bold text-xs bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-xs"
          >
            <HardHat className="size-4" />
            <span>+ Register New Worker</span>
          </Button>
        }
      />
      <RegisterWorkerWizard open={regWizardOpen} onOpenChange={setRegWizardOpen} />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <MetricCard label="Active Plant Shifts" value={4} detail="24/7 Operations" icon={Clock} />
        <MetricCard label="Total Assigned Workers" value={activeWorkerList.length} detail="Across all shifts" icon={Users} tone="success" />
        <MetricCard label="Assigned Dosimeters" value={activeWorkerList.length} detail="Pre-shift linked" icon={Boxes} tone="primary" />
        <MetricCard label="Shift Relationship Status" value="ACTIVE" detail="HSE Bindings Valid" icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {shiftGroups.map((s) => (
          <Panel key={s.id} className="p-5">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                  <Clock className="size-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base">{s.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{s.time}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 text-xs font-bold font-mono">
                {s.workers.length} Workers Linked
              </span>
            </div>

            {s.workers.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No workers currently assigned to {s.name}.
              </div>
            ) : (
              <div className="space-y-2">
                {s.workers.map((w) => (
                  <div key={w.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-xs bg-muted/30">
                    <div className="flex items-center gap-3">
                      <HardHat className="size-4 text-emerald-600" />
                      <div>
                        <div className="font-bold">{w.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">ID: {w.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-blue-600">{w.badgeId}</div>
                      <div className="text-[10px] text-muted-foreground">Assigned Badge</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        ))}
      </div>
    </>
  );
}
