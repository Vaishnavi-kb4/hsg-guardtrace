import { createFileRoute } from "@tanstack/react-router";
import { Boxes, CalendarClock, ClipboardCheck, TriangleAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MetricCard, PageHeader, Panel, PanelHeader, StatusBadge } from "@/components/h2s/common";
import { useApp } from "@/context/AppContext";
import type { BadgeRecord } from "@/types/h2s";

import { evaluateBadgeShelfLife } from "@/lib/badgeUtils";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Badge Inventory — H₂S GUARD" },
      { name: "description", content: "Passive dosimeter badge inventory, lot traceability, and expiry tracking." },
    ],
  }),
  component: BadgesPage,
});

function BadgesPage() {
  const { badges, registeredUsers, workers } = useApp();
  const [selected, setSelected] = useState<BadgeRecord | null>(null);
  const [assign, setAssign] = useState(false);

  const activeBadges = badges.filter((b) => evaluateBadgeShelfLife(b.expiry) === "VALID").length;
  const expiringSoon = badges.filter((b) => evaluateBadgeShelfLife(b.expiry) === "EXPIRING SOON").length;
  const expiredBadges = badges.filter((b) => evaluateBadgeShelfLife(b.expiry) === "INVALID").length;

  return (
    <>
      <PageHeader
        title="Passive Dosimeter Badge Inventory"
        subtitle="Digital identity records, manufacturing batch lot traceability, and expiration validity tracking."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active Valid Badges" value={activeBadges} detail="Assigned and active in service" icon={Boxes} tone="success" />
        <MetricCard label="Expiring Soon (< 30 Days)" value={expiringSoon} detail="Schedule lot replacement" icon={CalendarClock} tone="warning" />
        <MetricCard label="Expired / Invalid Badges" value={expiredBadges} detail="Remove from plant service" icon={TriangleAlert} tone="danger" />
        <MetricCard label="Total Tracked Inventory" value={badges.length} detail="Batch lot registered" icon={ClipboardCheck} />
      </div>

      <Panel>
        <PanelHeader
          title="Dosimeter Badge Inventory"
          subtitle="Identity, batch lot, manufacturing linkage, and expiry status"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-[10px] uppercase font-bold text-muted-foreground">
              <tr>
                {["Badge ID", "Batch Lot", "Assigned Worker", "Expiry Date", "Calibration", "Status", "Action"].map((h) => (
                  <th className="px-4 py-3" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {badges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                    No badges registered in inventory.
                  </td>
                </tr>
              ) : (
                badges.map((b) => {
                  const badgeStatus = evaluateBadgeShelfLife(b.expiry);
                  return (
                    <tr className="hover:bg-muted/50 transition-colors" key={b.id}>
                      <td className="px-4 py-3 font-mono font-bold text-xs">{b.id}</td>
                      <td className="px-4 py-3 font-mono text-xs">{b.batch}</td>
                      <td className="px-4 py-3 font-semibold">{b.workerId}</td>
                      <td className="px-4 py-3 text-xs">{b.expiry}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-blue-600 dark:text-blue-400">{b.calibration || "CAL-03 Model"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={badgeStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(b)} className="text-xs font-bold">
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
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="font-mono text-xl">{selected.id}</SheetTitle>
                  <StatusBadge status={selected.status} />
                </div>
                <SheetDescription>Digital passive dosimeter hardware record.</SheetDescription>
              </SheetHeader>

              <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
                <div className="text-[10px] uppercase font-bold text-blue-400">Passive Dosimeter ID</div>
                <div className="mt-1 font-mono text-3xl font-black">{selected.id}</div>
                <div className="mt-3 text-xs text-slate-300 font-mono">Manufacture Batch Lot: {selected.batch}</div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-muted/40 p-4 border border-border">
                {[
                  ["Batch Lot", selected.batch],
                  ["Manufacturing Date", selected.manufactured],
                  ["Expiration Date", selected.expiry],
                  ["Calibration Standard", selected.calibration || "CAL-03 Model"],
                  ["Assigned Worker ID", selected.workerId],
                  ["Lifetime Captures", String(selected.measurements ?? 0)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">{k}</div>
                    <div className="mt-0.5 text-xs font-bold font-mono">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={() => setAssign(true)} className="bg-blue-900 text-white font-bold text-xs">
                  Reassign Badge
                </Button>
                <Button variant="outline" onClick={() => toast.success(`Viewing records for badge ${selected.id}`)} className="text-xs font-bold">
                  Inspect Exposure History
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={assign} onOpenChange={setAssign}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Dosimeter Badge</DialogTitle>
            <DialogDescription>Assign this hardware badge to a field worker roster identity.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-2">
            <label className="text-xs font-bold block text-muted-foreground">Select Field Worker:</label>
            <select className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-semibold">
              {(registeredUsers.length > 0 ? registeredUsers : workers).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id} · {w.name} ({w.shift})
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={() => {
              setAssign(false);
              toast.success("Badge assignment updated successfully");
            }}
            className="w-full bg-blue-900 text-white font-bold text-xs h-10 rounded-xl"
          >
            Confirm Badge Assignment
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
