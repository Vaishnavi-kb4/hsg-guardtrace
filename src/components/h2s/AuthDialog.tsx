import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { UserPlus, LogIn, LogOut, ShieldCheck, Building, KeyRound, Mail, User } from "lucide-react";
import { toast } from "sonner";

export function AuthDialog({ open, onOpenChange }: { open?: boolean | undefined; onOpenChange?: ((open: boolean) => void) | undefined }) {
  const { currentUser, registerUser, loginUser, logoutUser } = useApp();
  const [tab, setTab] = useState<"login" | "register">("register");

  const getNewOfficerId = () => `HSE-${Math.floor(100 + Math.random() * 900)}`;

  // Registration state for HSE Safety Monitor
  const [name, setName] = useState("");
  const [officerId, setOfficerId] = useState(getNewOfficerId);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plantOrg, setPlantOrg] = useState("MRPL SRU Unit 09");

  // Login state
  const [loginEmailOrId, setLoginEmailOrId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Refresh officer ID when opened
  React.useEffect(() => {
    if (open) {
      setOfficerId(getNewOfficerId());
    }
  }, [open]);

  const handleRegisterHseOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!officerId.trim()) {
      toast.error("Please enter an Officer ID.");
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
      id: officerId.trim(),
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: "monitor",
      shift: "General Shift",
      badgeId: "B-00000",
      batchId: "BATCH-00",
      createdAt: new Date().toISOString(),
    });

    if (res.success) {
      setName("");
      setEmail("");
      setPassword("");
      setOfficerId(getNewOfficerId());
      if (onOpenChange) onOpenChange(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrId.trim()) {
      toast.error("Please enter your Officer/Worker ID or Email.");
      return;
    }
    if (!loginPassword.trim()) {
      toast.error("Please enter your Password.");
      return;
    }

    const res = loginUser(loginEmailOrId.trim(), loginPassword.trim());
    if (res.success && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open ?? false} onOpenChange={onOpenChange ? (v) => onOpenChange(v) : () => {}}>
      <DialogContent className="max-w-md p-6 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="size-5 text-emerald-600" />
            H₂S Guard — HSE Safety Monitor Portal
          </DialogTitle>
          <DialogDescription className="text-xs">
            Register new HSE Safety Monitor Officer accounts or log in. (Workers are registered by HSE Officers via the Register New Worker wizard).
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
            </div>

            <Button variant="outline" className="w-full text-destructive font-bold text-xs" onClick={logoutUser}>
              <LogOut className="size-4 mr-2" /> Log Out Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTab("register")}
                className={`rounded-lg py-2 transition ${tab === "register" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                <UserPlus className="inline size-3.5 mr-1" /> Register HSE Officer
              </button>
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`rounded-lg py-2 transition ${tab === "login" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LogIn className="inline size-3.5 mr-1" /> Log In
              </button>
            </div>

            {tab === "register" ? (
              <form onSubmit={handleRegisterHseOfficer} className="space-y-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900 dark:bg-emerald-950/40 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  🛡️ <b>HSE Safety Monitor Setup:</b> Registering an HSE Officer account with plant monitoring credentials.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold">Full Name *</Label>
                    <Input
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Officer ID *</Label>
                    <Input
                      required
                      placeholder="e.g. HSE-901"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      className="mt-1 h-9 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold">Official Email *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="hse.officer@plant.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Password *</Label>
                  <Input
                    required
                    type="password"
                    placeholder="Create password (min 3 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Plant / Organization</Label>
                  <Input
                    placeholder="e.g. MRPL SRU Unit 09"
                    value={plantOrg}
                    onChange={(e) => setPlantOrg(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs">
                  <UserPlus className="size-4 mr-2" /> Complete HSE Safety Monitor Setup
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <Label className="text-xs font-bold">Email or User ID</Label>
                  <Input
                    required
                    placeholder="Enter HSE Officer or Worker ID / Email"
                    value={loginEmailOrId}
                    onChange={(e) => setLoginEmailOrId(e.target.value)}
                    className="mt-1 h-9 text-xs font-mono"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Password / PIN</Label>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full mt-4 font-bold text-xs">
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
