import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { HardHat, Boxes, CheckCircle2, QrCode, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { LocalQrCode } from "./LocalQrCode";
import { getNextIterativeBadgeId, getNextIterativeBatchId, getNextIterativeWorkerId } from "@/lib/badgeUtils";

interface RegisterWorkerWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterWorkerWizard({ open, onOpenChange }: RegisterWorkerWizardProps) {
  const { registerUser, currentUser, badges, workers, registeredUsers } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Worker Info State
  const [name, setName] = useState("");
  const [workerId, setWorkerId] = useState("WRK-1026");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [department, setDepartment] = useState("Refinery Operations");
  const [shift, setShift] = useState("Morning Shift (06:00 AM – 02:00 PM)");
  const [password, setPassword] = useState("1234");

  // Step 2: Assign Badge State
  const [badgeId, setBadgeId] = useState("B-00126");
  const [batchId, setBatchId] = useState("BATCH-08");
  const [calibration] = useState("CAL-03");
  const [manufactured] = useState("20-Sep-2026");
  const [expiry] = useState("20-Dec-2026");
  const [badgeStatus] = useState("VALID");
  const [showQrScan, setShowQrScan] = useState(false);

  // Refresh default unique iterative values whenever opened
  useEffect(() => {
    if (open) {
      setStep(1);
      setName("");
      setEmailOrPhone("");
      setWorkerId(getNextIterativeWorkerId(workers, registeredUsers));
      setBadgeId(getNextIterativeBadgeId(badges, registeredUsers));
      setBatchId(getNextIterativeBatchId(badges, registeredUsers));
    }
  }, [open, badges, workers, registeredUsers]);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter the worker's full name.");
      return;
    }
    if (!workerId.trim()) {
      toast.error("Please enter a Worker / Employee ID.");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeId.trim()) {
      toast.error("Please enter or scan a Badge ID.");
      return;
    }
    setStep(3);
  };

  const handleConfirmAssignment = () => {
    const finalEmail = emailOrPhone.trim() && emailOrPhone.includes("@")
      ? emailOrPhone.trim()
      : `${workerId.trim().toLowerCase()}@plant.com`;

    const res = registerUser({
      id: workerId.trim(),
      name: name.trim(),
      email: finalEmail,
      password: password.trim() || "1234",
      role: "worker",
      shift,
      badgeId: badgeId.trim(),
      batchId: batchId.trim(),
      createdAt: new Date().toISOString(),
    });

    if (res.success) {
      toast.success(`✓ Worker ${workerId.trim()} (${name.trim()}) registered and assigned Badge ${badgeId.trim()}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 sm:p-7 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-emerald-700 text-white font-bold">
              <HardHat className="size-5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-black">Register New Worker & Assign Badge</DialogTitle>
              <DialogDescription className="text-xs">
                HSE Officer Workflow: Create worker account, assign physical H₂S cartridge, and bind shift schedule.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 my-2">
          <div className={`rounded-xl p-2 text-center text-xs font-bold transition ${step === 1 ? "bg-emerald-700 text-white" : step > 1 ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
            1. Worker Information
          </div>
          <div className={`rounded-xl p-2 text-center text-xs font-bold transition ${step === 2 ? "bg-emerald-700 text-white" : step > 2 ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
            2. Assign Badge
          </div>
          <div className={`rounded-xl p-2 text-center text-xs font-bold transition ${step === 3 ? "bg-emerald-700 text-white" : "bg-muted text-muted-foreground"}`}>
            3. Confirm Shift & Link
          </div>
        </div>

        {/* STEP 1: Worker Information */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4 py-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Arun Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-10 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Worker / Employee ID *</Label>
                <Input
                  required
                  placeholder="e.g. WRK-1025"
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  className="mt-1 h-10 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold">Official Email or Phone (Optional)</Label>
                <Input
                  placeholder="e.g. arun.kumar@plant.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="mt-1 h-10 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Department / Work Area *</Label>
                <Input
                  required
                  placeholder="e.g. Refinery Operations"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold">Assigned Shift *</Label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-card px-2 text-xs font-semibold"
                >
                  <option>Morning Shift (06:00 AM – 02:00 PM)</option>
                  <option>General Shift (09:00 AM – 05:00 PM)</option>
                  <option>Evening Shift (02:00 PM – 10:00 PM)</option>
                  <option>Night Shift (10:00 PM – 06:00 AM)</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-bold">Worker Login Password / PIN</Label>
                <Input
                  required
                  type="password"
                  placeholder="Set worker login PIN (e.g. 1234)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 h-10 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold">
                Next: Assign Badge <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Assign Badge */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-4 py-2">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                  <Boxes className="size-4 text-blue-600" /> Physical H₂S Guard Cartridge Details
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowQrScan(!showQrScan)}
                  className="h-7 text-[10px] font-bold border-blue-300 text-blue-900 dark:text-blue-200"
                >
                  <QrCode className="size-3 mr-1" /> {showQrScan ? "Hide QR Scanner" : "Scan Badge QR"}
                </Button>
              </div>

              {/* Summary Worker ID Bar */}
              <div className="mb-3 rounded-xl bg-white dark:bg-slate-900 p-3 border border-blue-200 dark:border-blue-900 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Selected Worker</span>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{name || "Field Worker"}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Worker / Emp ID</span>
                  <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    {workerId}
                  </span>
                </div>
              </div>

              {showQrScan && (
                <div className="my-3 text-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200">
                  <LocalQrCode value={`H2S-BADGE:${badgeId}:${batchId}`} size={100} />
                  <div className="text-[10px] font-mono font-bold mt-2 text-slate-600">Scanned QR Code: {badgeId}</div>
                </div>
              )}

              {/* 3 Explicit Input Fields: Worker ID, Badge ID, Batch ID */}
              <div className="grid sm:grid-cols-3 gap-3 mt-2">
                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 text-emerald-950 dark:text-emerald-300">
                    <span>👷 Worker ID *</span>
                  </Label>
                  <Input
                    required
                    value={workerId}
                    onChange={(e) => setWorkerId(e.target.value)}
                    placeholder="e.g. WRK-1025"
                    className="mt-1 h-9 text-xs font-mono font-bold bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 text-blue-950 dark:text-blue-200">
                    <span>🪪 Badge ID *</span>
                  </Label>
                  <Input
                    required
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    placeholder="e.g. B-00126"
                    className="mt-1 h-9 text-xs font-mono font-bold bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 text-slate-800 dark:text-slate-300">
                    <span>📦 Batch ID *</span>
                  </Label>
                  <Input
                    required
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    placeholder="e.g. BATCH-08"
                    className="mt-1 h-9 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div className="rounded-lg bg-background p-2 border border-border">
                  <span className="block text-[9px] text-muted-foreground font-bold uppercase">Calibration</span>
                  <span className="font-mono font-bold">{calibration}</span>
                </div>
                <div className="rounded-lg bg-background p-2 border border-border">
                  <span className="block text-[9px] text-muted-foreground font-bold uppercase">Manufactured</span>
                  <span className="font-mono font-bold">{manufactured}</span>
                </div>
                <div className="rounded-lg bg-background p-2 border border-border">
                  <span className="block text-[9px] text-muted-foreground font-bold uppercase">Expiry Date</span>
                  <span className="font-mono font-bold text-emerald-600">{expiry}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="text-xs">
                <ArrowLeft className="size-4 mr-1" /> Back
              </Button>
              <Button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold">
                Next: Assign Shift & Confirm <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: Confirm Shift & Relationship */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/40 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-700 dark:text-emerald-300">
                    System Relationship Assignment Summary
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">{name}</h3>
                </div>
                <span className="rounded-full bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1">
                  ✓ Ready to Link
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Worker ID:</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">{workerId}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{department}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Assigned Badge:</span>
                  <div className="font-mono font-bold text-blue-700 dark:text-blue-300 text-sm">{badgeId} ({batchId})</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Badge Shelf Life:</span>
                  <div className="font-bold text-emerald-600">✅ VALID (Expiry: {expiry})</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Assigned Shift:</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{shift}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Assignment Date:</span>
                  <div className="font-mono text-slate-900 dark:text-slate-100">26-Sep-2026</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
              <b>Backend Relationship:</b> HSE Officer <b>{currentUser?.name || "Officer"}</b> → Worker <b>{workerId}</b> → Badge <b>{badgeId}</b> → Batch <b>{batchId}</b> → Shift <b>{shift}</b>. The worker is not required to type the badge ID manually.
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="text-xs">
                <ArrowLeft className="size-4 mr-1" /> Back
              </Button>
              <Button onClick={handleConfirmAssignment} className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-6">
                <CheckCircle2 className="size-4 mr-1.5" /> Confirm Assignment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
