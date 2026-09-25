import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, HardHat, LogIn, UserPlus, Smartphone, Monitor, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@/types/h2s";

export function AuthGatewayView() {
  const { registerUser, loginUser, registeredUsers } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>("worker");
  const [tab, setTab] = useState<"login" | "register">("login");

  // Registration state
  const [name, setName] = useState("");
  const [workerId, setWorkerId] = useState(`W-${Math.floor(100 + Math.random() * 900)}`);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shift, setShift] = useState("Morning Shift");
  const [badgeId, setBadgeId] = useState(`B-${Math.floor(10000 + Math.random() * 90000)}`);
  const [batchId, setBatchId] = useState("BATCH-01");

  // Login state
  const [loginIdOrEmail, setLoginIdOrEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!workerId.trim()) {
      toast.error("Please enter a Worker or Officer ID.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address (e.g. name@company.com).");
      return;
    }
    if (!password.trim() || password.trim().length < 3) {
      toast.error("Password must be at least 3 characters long.");
      return;
    }

    registerUser({
      id: workerId.trim(),
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: selectedRole,
      shift,
      badgeId: badgeId.trim(),
      batchId: batchId.trim(),
      createdAt: new Date().toISOString(),
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdOrEmail.trim()) {
      toast.error("Please enter your Worker/Officer ID or Email.");
      return;
    }
    if (!loginPass.trim()) {
      toast.error("Please enter your Password / PIN.");
      return;
    }

    loginUser(loginIdOrEmail.trim(), loginPass.trim());
  };

  const quickLoginAsWorker = () => {
    loginUser("W-102", "123");
  };

  const quickLoginAsMonitor = () => {
    loginUser("HSE-901", "123");
  };

  return (
    <div className="mx-auto max-w-4xl py-6">
      {/* Header Banner */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200">
          <ShieldCheck className="size-4 text-blue-600" /> H₂S Guard Authentication Portal
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Choose User Type to Access Portal
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          First choose your account type below, then sign in or register to open your separate interface.
        </p>
      </div>

      {/* STEP 1: Choose 2 Types of Users */}
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 text-center">
          Step 1: Choose Account Type First
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {/* User Type 1: Field Worker */}
          <div
            onClick={() => setSelectedRole("worker")}
            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
              selectedRole === "worker"
                ? "border-blue-900 bg-blue-50/70 shadow-lg ring-2 ring-blue-900/20 dark:border-blue-500 dark:bg-blue-950/60"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-blue-900 text-white">
                  <Smartphone className="size-6" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">User Type 1</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">Field Worker</h3>
                </div>
              </div>
              <span className={`size-6 rounded-full border-2 grid place-items-center ${selectedRole === "worker" ? "border-blue-900 bg-blue-900 text-white" : "border-slate-300"}`}>
                {selectedRole === "worker" && <CheckCircle2 className="size-4" />}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Field Worker Interface — Pre/Post Shift Dosimetry & Optical Analysis.
            </p>
            <div className="text-[11px] font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
              <span>Access Personal Exposure Record</span>
              <ArrowRight className="size-3" />
            </div>
          </div>

          {/* User Type 2: Safety Monitor */}
          <div
            onClick={() => setSelectedRole("monitor")}
            className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
              selectedRole === "monitor"
                ? "border-emerald-700 bg-emerald-50/70 shadow-lg ring-2 ring-emerald-700/20 dark:border-emerald-500 dark:bg-emerald-950/60"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-emerald-700 text-white">
                  <Monitor className="size-6" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">User Type 2</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">HSE Safety Monitor</h3>
                </div>
              </div>
              <span className={`size-6 rounded-full border-2 grid place-items-center ${selectedRole === "monitor" ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300"}`}>
                {selectedRole === "monitor" && <CheckCircle2 className="size-4" />}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              HSE Officer Interface — Roster & Plant Exposure Analytics.
            </p>
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <span>Access Plant Safety Dashboard</span>
              <ArrowRight className="size-3" />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: Main Authentication Box */}
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 mt-6">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 text-center">
          Step 2: Sign In or Register as {selectedRole === "worker" ? "Field Worker" : "HSE Safety Monitor"}
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold mb-6 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`rounded-lg py-2.5 transition ${tab === "login" ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}
          >
            <LogIn className="inline size-4 mr-1.5" /> Log In Account
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`rounded-lg py-2.5 transition ${tab === "register" ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}
          >
            <UserPlus className="inline size-4 mr-1.5" /> Register Details
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-xs font-bold">
                {selectedRole === "worker" ? "Worker ID or Email" : "Officer ID or Email"}
              </Label>
              <Input
                required
                placeholder={selectedRole === "worker" ? "e.g. W-102 or worker@plant.com" : "e.g. HSE-901 or officer@plant.com"}
                value={loginIdOrEmail}
                onChange={(e) => setLoginIdOrEmail(e.target.value)}
                className="mt-1.5 h-11 text-sm font-mono"
              />
            </div>

            <div>
              <Label className="text-xs font-bold">Password / PIN</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="mt-1.5 h-11 text-sm"
              />
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-white font-bold text-sm rounded-xl ${selectedRole === "worker" ? "bg-blue-900 hover:bg-blue-800" : "bg-emerald-700 hover:bg-emerald-600"}`}
            >
              <LogIn className="size-4 mr-2" /> Log In as {selectedRole === "worker" ? "Field Worker" : "Safety Monitor"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
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
                <Label className="text-xs font-bold">{selectedRole === "worker" ? "Worker ID *" : "Officer ID *"}</Label>
                <Input
                  required
                  placeholder={selectedRole === "worker" ? "e.g. W-108" : "e.g. HSE-901"}
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  className="mt-1 h-10 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold">Email Address *</Label>
              <Input
                required
                type="email"
                placeholder="user@plant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 text-xs"
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
                className="mt-1 h-10 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs font-bold">Shift</Label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-card px-2 text-xs dark:border-slate-700"
                >
                  <option>Morning Shift</option>
                  <option>General Shift</option>
                  <option>Evening Shift</option>
                  <option>Night Shift</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-bold">Assigned Badge</Label>
                <Input
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  className="mt-1 h-10 text-xs font-mono"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Batch ID</Label>
                <Input
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="mt-1 h-10 text-xs font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-white font-bold text-sm rounded-xl mt-4 ${selectedRole === "worker" ? "bg-blue-900 hover:bg-blue-800" : "bg-emerald-700 hover:bg-emerald-600"}`}
            >
              <UserPlus className="size-4 mr-2" /> Register & Access {selectedRole === "worker" ? "Field Worker App" : "Safety Monitor Dashboard"}
            </Button>
          </form>
        )}

        {/* Quick Demo Logins */}
        <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
          <span className="text-[10px] font-bold uppercase text-slate-500 block mb-2 text-center">
            ⚡ Quick Demo Sign In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={quickLoginAsWorker} className="text-xs font-bold gap-1 text-blue-900 dark:text-blue-300">
              <Smartphone className="size-3.5" /> Login as Field Worker
            </Button>
            <Button variant="outline" size="sm" onClick={quickLoginAsMonitor} className="text-xs font-bold gap-1 text-emerald-800 dark:text-emerald-300">
              <Monitor className="size-3.5" /> Login as Safety Officer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
