import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { UserCheck, UserPlus, LogIn, LogOut, ShieldCheck, HardHat, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@/types/h2s";

export function AuthDialog({ open, onOpenChange }: { open?: boolean | undefined; onOpenChange?: ((open: boolean) => void) | undefined }) {
  const { currentUser, registeredUsers, registerUser, loginUser, logoutUser } = useApp();
  const [tab, setTab] = useState<"login" | "register">("register");

  const getNewWorkerId = () => `W-${Math.floor(100 + Math.random() * 900)}`;
  const getNewBadgeId = () => `B-${Math.floor(10000 + Math.random() * 90000)}`;
  const getNewBatchId = () => `BATCH-${Math.floor(10 + Math.random() * 90)}`;

  // Registration state
  const [name, setName] = useState("");
  const [workerId, setWorkerId] = useState(getNewWorkerId);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("worker");
  const [shift, setShift] = useState("Morning Shift");
  const [badgeId, setBadgeId] = useState(getNewBadgeId);
  const [batchId, setBatchId] = useState(getNewBatchId);

  // Login state
  const [loginEmailOrId, setLoginEmailOrId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Refresh unique IDs whenever dialog opens
  React.useEffect(() => {
    if (open) {
      setWorkerId(getNewWorkerId());
      setBadgeId(getNewBadgeId());
      setBatchId(getNewBatchId());
    }
  }, [open]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!workerId.trim()) {
      toast.error("Please enter a Worker/Officer ID.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password.trim() || password.trim().length < 3) {
      toast.error("Password must be at least 3 characters long.");
      return;
    }

    const res = registerUser({
      id: workerId.trim(),
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      shift,
      badgeId: badgeId.trim(),
      batchId: batchId.trim(),
      createdAt: new Date().toISOString(),
    });

    if (res.success) {
      setName("");
      setEmail("");
      setPassword("");
      setWorkerId(getNewWorkerId());
      setBadgeId(getNewBadgeId());
      setBatchId(getNewBatchId());
      if (onOpenChange) onOpenChange(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrId.trim()) {
      toast.error("Please enter your Worker ID or Email.");
      return;
    }
    if (!loginPassword.trim()) {
      toast.error("Please enter your Password / PIN.");
      return;
    }

    const res = loginUser(loginEmailOrId.trim(), loginPassword.trim());
    if (res.success && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open ?? false} onOpenChange={onOpenChange ? (v) => onOpenChange(v) : () => {}}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="size-5 text-primary" />
            H₂S Guard — User Account & Auth
          </DialogTitle>
          <DialogDescription>
            Register worker details or log in. All user records sync dynamically to the Safety Monitor Dashboard.
          </DialogDescription>
        </DialogHeader>

        {currentUser ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-primary tracking-wider">
                  Logged in Account
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${currentUser.role === "worker" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                  {currentUser.role === "worker" ? "👷 Field Worker" : "🛡️ HSE Safety Monitor"}
                </span>
              </div>
              <div className="mt-3 font-bold text-lg">{currentUser.name}</div>
              <div className="mt-1 text-xs text-muted-foreground font-mono">
                ID: {currentUser.id} · Email: {currentUser.email}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-border pt-3">
                <div><span className="text-muted-foreground">Shift:</span> <b className="text-foreground">{currentUser.shift}</b></div>
                <div><span className="text-muted-foreground">Badge ID:</span> <b className="font-mono text-foreground">{currentUser.badgeId}</b></div>
                <div><span className="text-muted-foreground">Batch ID:</span> <b className="font-mono text-foreground">{currentUser.batchId}</b></div>
              </div>
            </div>

            <Button variant="outline" className="w-full text-destructive" onClick={logoutUser}>
              <LogOut className="size-4 mr-2" /> Log Out Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTab("register")}
                className={`rounded-md py-2 transition ${tab === "register" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                <UserPlus className="inline size-3.5 mr-1" /> Register Account
              </button>
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`rounded-md py-2 transition ${tab === "login" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LogIn className="inline size-3.5 mr-1" /> Login Details
              </button>
            </div>

            {tab === "register" ? (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <Label className="text-xs">Account Role</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("worker")}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-2 text-xs font-bold ${role === "worker" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
                    >
                      <HardHat className="size-4" /> Field Worker
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("monitor")}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-2 text-xs font-bold ${role === "monitor" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
                    >
                      <ShieldCheck className="size-4" /> Safety Monitor
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Full Name *</Label>
                    <Input
                      required
                      placeholder="e.g. Arun Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Worker / Emp ID *</Label>
                    <Input
                      required
                      placeholder="e.g. W-108"
                      value={workerId}
                      onChange={(e) => setWorkerId(e.target.value)}
                      className="mt-1 h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="worker@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">Password *</Label>
                  <Input
                    required
                    type="password"
                    placeholder="Create password (min 3 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Shift</Label>
                    <select
                      value={shift}
                      onChange={(e) => setShift(e.target.value)}
                      className="mt-1 h-9 w-full rounded-md border border-border bg-card px-2 text-xs"
                    >
                      <option>Morning Shift</option>
                      <option>General Shift</option>
                      <option>Evening Shift</option>
                      <option>Night Shift</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Assigned Badge</Label>
                    <Input
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      className="mt-1 h-9 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Batch ID</Label>
                    <Input
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      className="mt-1 h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4">
                  <UserPlus className="size-4 mr-2" /> Complete User Registration
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3">
                {registeredUsers.length > 0 && (
                  <div>
                    <Label className="text-xs">Quick Select Registered User</Label>
                    <div className="mt-1.5 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {registeredUsers.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setLoginEmailOrId(u.id);
                            const res = loginUser(u.id, u.password || "123");
                            if (res.success && onOpenChange) onOpenChange(false);
                          }}
                          className="w-full flex items-center justify-between rounded-lg border border-border bg-card p-2.5 text-left text-xs hover:border-primary hover:bg-primary/5"
                        >
                          <div>
                            <div className="font-bold">{u.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{u.id} · {u.shift}</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${u.role === "worker" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                            {u.role === "worker" ? "Worker" : "Monitor"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-xs">Worker ID or Email</Label>
                  <Input
                    placeholder="Enter ID (e.g. W-102) or Email"
                    value={loginEmailOrId}
                    onChange={(e) => setLoginEmailOrId(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">Password / PIN</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full mt-4">
                  <LogIn className="size-4 mr-2" /> Log In Account
                </Button>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
