import { createFileRoute } from "@tanstack/react-router";
import { Activity, Clock3, UserRound, HardHat, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ExposureChart } from "@/components/h2s/Charts";
import { MetricCard, PageHeader, Panel, PanelHeader, StatusBadge } from "@/components/h2s/common";
import { useApp } from "@/context/AppContext";
import type { Worker } from "@/types/h2s";

import { evaluateBadgeShelfLife } from "@/lib/badgeUtils";

import { RegisterWorkerWizard } from "@/components/h2s/RegisterWorkerWizard";

export const Route = createFileRoute("/workers")({
  head: () => ({
    meta: [
      { title: "Workers — H₂S GUARD" },
      { name: "description", content: "Occupational health worker roster and exposure monitoring." },
    ],
  }),
  component: WorkersPage,
});

function WorkersPage() {
  const { workers, registeredUsers, measurements, badges } = useApp();
  const [selected, setSelected] = useState<Worker | null>(null);
  const [regWizardOpen, setRegWizardOpen] = useState(false);

  // Combine registered worker accounts with workers array
  const allWorkers: Worker[] = Array.from(
    new Map(
      [
        ...registeredUsers
          .filter((u) => u.role === "worker")
          .map((u) => {
            const userMeas = measurements.filter((m) => m.workerId === u.id);
            const latest = userMeas.length > 0 ? userMeas[0] : null;
            return {
              id: u.id,
              name: u.name,
              shift: u.shift,
              badgeId: u.badgeId,
              latestExposure: latest?.exposure ?? 0,
              lastMeasurement: latest?.time || "Registered worker",
              status: "Active" as const,
            };
          }),
        ...workers,
      ].map((w) => [w.id, w])
    ).values()
  );

  // Dynamic counts
  const highRiskCount = allWorkers.filter((w) => (w.latestExposure ?? 0) > 20.0).length;
  const measuredCount = allWorkers.filter((w) => (w.latestExposure ?? 0) > 0).length;
  const zeroExposureCount = allWorkers.filter((w) => (w.latestExposure ?? 0) === 0).length;

  return (
    <>
      <PageHeader
        title="Worker Exposure Roster"
        subtitle="Assigned wristband badges, live cumulative exposure levels, and workplace threshold status."
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

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <MetricCard label="Active Roster Monitored" value={allWorkers.length} detail="Assigned field workers" icon={UserRound} />
        <MetricCard label="Measured Exposure Records" value={measuredCount} detail={`${allWorkers.length ? Math.round((measuredCount / allWorkers.length) * 100) : 0}% roster coverage`} icon={Activity} tone="success" />
        <MetricCard label="High / Moderate Risk Alerts" value={highRiskCount} detail={highRiskCount > 0 ? "Action required by safety officer" : "Zero high risk workers"} icon={ShieldAlert} tone={highRiskCount > 0 ? "danger" : "primary"} />
      </div>

      <Panel>
        <PanelHeader
          title="Worker Roster & Dosimetry Exposure Status"
          subtitle={`${allWorkers.length} registered workers monitored`}
          action={
            <Button
              size="sm"
              onClick={() => setRegWizardOpen(true)}
              className="gap-1 font-bold text-xs bg-emerald-700 hover:bg-emerald-600 text-white"
            >
              + Register New Worker
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-[10px] uppercase font-bold text-muted-foreground">
              <tr>
                {["Worker ID", "Name", "Shift", "Assigned Badge", "Latest Exposure", "Last Measurement", "Exposure Status", "Validity of Shelf Life", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allWorkers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground text-xs">
                    <HardHat className="mx-auto size-8 text-slate-400 mb-2" />
                    No workers currently registered.
                  </td>
                </tr>
              ) : (
                allWorkers.map((w) => {
                  const expVal = w.latestExposure ?? 0;
                  const statusToDisplay =
                    expVal > 20.0
                      ? "HIGH"
                      : expVal >= 8.0
                      ? "MODERATE"
                      : expVal > 0
                      ? "VALID"
                      : "ACTIVE";

                  const b = badges.find((x) => x.id === w.badgeId);
                  const shelfLife = evaluateBadgeShelfLife(b?.expiry || "12 Jan 2027");

                  return (
                    <tr className="hover:bg-muted/50 transition-colors" key={w.id}>
                      <td className="px-4 py-3 font-mono font-bold text-xs">{w.id}</td>
                      <td className="px-4 py-3 font-semibold">{w.name}</td>
                      <td className="px-4 py-3 text-xs">{w.shift}</td>
                      <td className="px-4 py-3 font-mono text-xs">{w.badgeId}</td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-900 dark:text-blue-300">
                        {w.latestExposure !== undefined && w.latestExposure !== null
                          ? `${w.latestExposure.toFixed(1)} ppm·h`
                          : "0.0 ppm·h"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{w.lastMeasurement || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={statusToDisplay} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={shelfLife} />
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(w)} className="text-xs font-bold">
                          View details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-auto sm:max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle>Worker {selected.id} — {selected.name}</SheetTitle>
                  <StatusBadge
                    status={
                      (selected.latestExposure ?? 0) > 20.0
                        ? "HIGH"
                        : (selected.latestExposure ?? 0) >= 8.0
                        ? "MODERATE"
                        : (selected.latestExposure ?? 0) > 0
                        ? "VALID"
                        : "ACTIVE"
                    }
                  />
                </div>
                <SheetDescription>Occupational health worker profile and cumulative exposure log.</SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Info k="Current Shift" v={selected.shift} />
                <Info k="Assigned Badge" v={selected.badgeId} />
                <Info k="Latest Exposure" v={`${(selected.latestExposure ?? 0).toFixed(1)} ppm·h`} />
                <Info
                  k="Workplace Hazard Level"
                  v={
                    (selected.latestExposure ?? 0) > 20.0
                      ? "🚨 HIGH EXPOSURE ALERT"
                      : (selected.latestExposure ?? 0) >= 8.0
                      ? "⚠ MODERATE EXPOSURE"
                      : "✓ Safe Exposure Level"
                  }
                />
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-sm mb-2">Exposure History Trend</h3>
                <ExposureChart />
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="font-bold text-sm">Measurement Timeline</h3>
                {measurements.filter((m) => m.workerId === selected.id).length === 0 ? (
                  <div className="rounded-lg border p-4 text-xs text-muted-foreground text-center">
                    No individual measurements logged yet for worker {selected.id}.
                  </div>
                ) : (
                  measurements
                    .filter((m) => m.workerId === selected.id)
                    .map((m) => (
                      <div className="flex items-center justify-between rounded-lg border border-border p-3 text-xs" key={m.id}>
                        <div>
                          <b className="font-mono">{m.id}</b> · {m.timestamp}
                        </div>
                        <div className="font-mono font-bold text-blue-600">{m.exposure} ppm·h</div>
                      </div>
                    ))
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="text-[10px] font-bold uppercase text-muted-foreground">{k}</div>
      <div className="mt-1 text-sm font-semibold">{v}</div>
    </div>
  );
}
