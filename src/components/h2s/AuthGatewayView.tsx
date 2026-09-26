import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, HardHat, LogIn, UserPlus, Sparkles, ArrowRight, Building, KeyRound, Mail, User } from "lucide-react";
import { toast } from "sonner";

export function AuthGatewayView() {
  const { registerUser, loginUser, registeredUsers } = useApp();
  const [mode, setMode] = useState<"login" | "officer_register">("login");

  // Sign In State
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");

  // First-Time HSE Officer Registration State
  const [officerName, setOfficerName] = useState("");
  const [officerId, setOfficerId] = useState(`HSE-${Math.floor(100 + Math.random() * 900)}`);
  const [officerEmail, setOfficerEmail] = useState("");
  const [officerPassword, setOfficerPassword] = useState("");
  const [plantOrg, setPlantOrg] = useState("MRPL SRU Unit 09");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) {
      toast.error("Please enter your Email or User ID.");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your Password.");
      return;
    }

    loginUser(emailOrId.trim(), password.trim());
  };

  const handleOfficerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerName.trim()) {
      toast.error("Please enter your Full Name.");
      return;
    }
    if (!officerId.trim()) {
      toast.error("Please enter an Officer ID.");
      return;
    }
    if (!officerEmail.trim()) {
      toast.error("Please enter your Official Email.");
      return;
    }
    if (!officerPassword.trim() || officerPassword.trim().length < 3) {
      toast.error("Password must be at least 3 characters long.");
      return;
    }

    const res = registerUser({
      id: officerId.trim(),
      name: officerName.trim(),
      email: officerEmail.trim(),
      password: officerPassword.trim(),
      role: "monitor",
      shift: "General Shift",
      badgeId: "B-00000",
      batchId: "BATCH-00",
      createdAt: new Date().toISOString(),
    });

    if (res.success) {
      toast.success(`✓ HSE Officer ${officerName.trim()} registered successfully!`);
    }
  };

  const demoLoginAsOfficer = () => {
    setEmailOrId("HSE-901");
    setPassword("123");
    loginUser("HSE-901", "123");
  };

  const demoLoginAsWorker = () => {
    setEmailOrId("WRK-1025");
    setPassword("123");
    loginUser("WRK-1025", "123");
  };

  return (
    <div className="mx-auto max-w-md py-8 px-4">
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 text-white shadow-xl">
          <ShieldCheck className="size-9 text-blue-400" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-3">
          H₂S Guard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {mode === "login" ? "Sign in to your account" : "First-Time HSE Officer Setup"}
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {mode === "login" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email / User ID
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <Input
                  required
                  placeholder="Enter Email or ID (e.g. WRK-1025 or HSE-901)"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="pl-10 h-11 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => toast.info("For demo accounts, default password is: 123")}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3.5 top-3 size-4 text-slate-400" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              <LogIn className="size-4 mr-2" /> Sign In
            </Button>
          </form>
        ) : (
          /* HSE Officer Setup Form */
          <form onSubmit={handleOfficerRegister} className="space-y-3">
            <div>
              <Label className="text-xs font-bold">Full Name *</Label>
              <Input
                required
                placeholder="e.g. Rajesh Sharma"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="mt-1 h-10 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold">Officer ID *</Label>
                <Input
                  required
                  placeholder="e.g. HSE-901"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="mt-1 h-10 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Role</Label>
                <Input
                  disabled
                  value="HSE Officer"
                  className="mt-1 h-10 text-xs font-bold bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold">Official Email *</Label>
              <Input
                required
                type="email"
                placeholder="hse.officer@plant.com"
                value={officerEmail}
                onChange={(e) => setOfficerEmail(e.target.value)}
                className="mt-1 h-10 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold">Password *</Label>
              <Input
                required
                type="password"
                placeholder="Create password (min 3 chars)"
                value={officerPassword}
                onChange={(e) => setOfficerPassword(e.target.value)}
                className="mt-1 h-10 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold">Plant / Organization</Label>
              <Input
                placeholder="e.g. MRPL SRU Unit 09"
                value={plantOrg}
                onChange={(e) => setPlantOrg(e.target.value)}
                className="mt-1 h-10 text-xs"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl mt-3 shadow-md"
            >
              <UserPlus className="size-4 mr-2" /> Complete HSE Officer Setup
            </Button>
          </form>
        )}

        {/* Footer / Toggle Mode */}
        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
          {mode === "login" ? (
            <button
              type="button"
              onClick={() => setMode("officer_register")}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
            >
              First-Time HSE Officer Setup → <span className="text-blue-600 font-extrabold underline ml-1">Register Here</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
            >
              ← Back to <span className="text-blue-600 font-extrabold underline ml-1">Main Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
