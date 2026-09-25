import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { WristbandDosimeter } from "./WristbandDosimeter";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Globe,
  Home,
  User,
  History,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Wifi,
  Send,
  Info,
  Check,
  RotateCcw,
  Sun,
  MoonStar,
  Layers,
  ArrowLeftRight
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import type { Measurement } from "@/types/h2s";

type MobileScreen = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ShiftCaptureMode = "pre" | "post";

export function WorkerMobileApp({ standalone = false }: { standalone?: boolean }) {
  const { currentUser, measurements, saveMeasurement } = useApp();
  const [screen, setScreen] = useState<MobileScreen>(1);
  const [language, setLanguage] = useState("English");
  const [activeTab, setActiveTab] = useState<"Home" | "History" | "Guide" | "Profile">("Home");

  // Dynamic user data or fallbacks
  const workerId = currentUser?.id || "W-101";
  const workerName = currentUser?.name || "Field Worker";
  const shift = currentUser?.shift || "Morning Shift";
  const badgeId = currentUser?.badgeId || "B-00101";
  const batchId = currentUser?.batchId || "BATCH-01";

  // Pre-Shift Base Color state
  const [preShiftRecorded, setPreShiftRecorded] = useState(false);
  const [preShiftTime, setPreShiftTime] = useState<string | null>(null);
  const [preShiftColor, setPreShiftColor] = useState<{ r: number; g: number; b: number }>({ r: 175, g: 160, b: 138 });

  // Shift capture mode state ("pre" vs "post")
  const [captureMode, setCaptureMode] = useState<ShiftCaptureMode>("pre");

  // Active measurement during capture flow
  const [currentResult, setCurrentResult] = useState<Measurement | null>(null);
  const [validationDone, setValidationDone] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // HSE Assistant chatbot state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Hello! I am your HSE Assistant. I can help explain verified exposure measurements based on approved plant safety guidelines.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Helper for exposure history for this user
  const userMeasurements = measurements.filter((m) => m.workerId === workerId || measurements.length === 0);
  const firstMeas = userMeasurements[0];
  const latestExposure = firstMeas && firstMeas.exposure !== null && firstMeas.exposure !== undefined
    ? `${firstMeas.exposure.toFixed(1)} ppm·h`
    : "0.0 ppm·h";

  // Start Capture Flow (specify Pre-Shift or Post-Shift)
  const handleStartCapture = (mode: ShiftCaptureMode) => {
    setCaptureMode(mode);
    setScreen(2);
  };

  const handleExecuteCapture = async () => {
    setIsProcessing(true);
    setScreen(3);
    setValidationDone([]);

    const steps = [
      "Badge detected",
      "Sensing region detected",
      "Reference region detected",
      "Image quality acceptable",
      "Badge validity confirmed",
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 220));
      setValidationDone((prev) => [...prev, step]);
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    if (captureMode === "pre") {
      // PRE-SHIFT CAPTURE: Record pristine Base Color
      const baseRgb = { r: 178, g: 162, b: 140 };
      setPreShiftRecorded(true);
      setPreShiftTime(timeStr);
      setPreShiftColor(baseRgb);

      toast.success("Pre-Shift Base Color recorded successfully!");
      setIsProcessing(false);
      setScreen(1); // Return to home showing pre-shift recorded state
      return;
    }

    // POST-SHIFT CAPTURE: Calculate cumulative exposure against Pre-Shift Base Color
    const postRgb = { r: 105, g: 85, b: 70 };
    // Calculate exposure delta
    const colorDelta = Math.sqrt(
      Math.pow(preShiftColor.r - postRgb.r, 2) +
      Math.pow(preShiftColor.g - postRgb.g, 2) +
      Math.pow(preShiftColor.b - postRgb.b, 2)
    );
    const calculatedPpm = Math.round((colorDelta / 45) * 10) / 10;

    const newMeas: Measurement = {
      id: `MEAS-${Math.floor(1000 + Math.random() * 9000)}`,
      traceId: `TRACE-${Date.now()}`,
      workerId,
      badgeId,
      batchId,
      shift,
      timestamp: `${dateStr}, ${timeStr}`,
      time: timeStr,
      exposure: calculatedPpm,
      calibration: "CAL-03",
      status: "VALID",
      quality: 96,
      uncertainty: "Experimentally determined",
      temperature: "31.2 °C",
      humidity: "66% RH",
      color: postRgb,
      preShiftColor: preShiftColor,
      preShiftTime: preShiftTime || "08:00 AM",
      postShiftTime: timeStr,
      source: "camera",
    };

    setCurrentResult(newMeas);
    setIsProcessing(false);
  };

  const handleSaveMeasurement = async () => {
    if (currentResult) {
      await saveMeasurement(currentResult);
      toast.success("Post-Shift exposure record saved to trace history & HSE Dashboard");
      setScreen(6);
    }
  };

  // HSE Assistant responder
  const handleSendChatMessage = (textToUse?: string) => {
    const q = textToUse || chatInput;
    if (!q.trim()) return;

    const userMsg = q;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    if (!textToUse) setChatInput("");

    let botAns = "This is an estimated cumulative exposure based on pre/post shift color normalization. Please follow your approved HSE procedures for any required action.";
    const lower = userMsg.toLowerCase();

    if (lower.includes("result") || lower.includes("mean") || lower.includes("ppm")) {
      botAns = `Your post-shift exposure reading is ${latestExposure}. This value represents cumulative passive H₂S dose accumulated during your shift compared to your pre-shift base color.`;
    } else if (lower.includes("limit") || lower.includes("safe") || lower.includes("action")) {
      botAns = "Based on verified measurement and approved HSE information: Always refer to your plant's standard operating procedure (SOP) for action limits. The dosimeter provides cumulative evidence but does not replace real-time gas alarm monitors.";
    }

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: "bot", text: botAns }]);
    }, 400);
  };

  return (
    <div className={`mx-auto max-w-md overflow-hidden rounded-3xl border-4 border-slate-800 bg-slate-950 shadow-2xl ${standalone ? "my-6" : ""}`}>
      {/* Phone Screen Frame Container */}
      <div className="flex min-h-[740px] flex-col bg-slate-50 text-slate-900 font-sans dark:bg-slate-900 dark:text-slate-100">
        
        {/* Top Status Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black tracking-wider text-blue-400">H₂S GUARD</span>
            <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">WORKER APP</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <Globe className="size-3 text-blue-400" />
              <select
                aria-label="Select mobile language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="English" className="bg-slate-900 text-slate-100">English ▼</option>
                <option value="Tamil" className="bg-slate-900 text-slate-100">தமிழ் (Tamil)</option>
                <option value="Hindi" className="bg-slate-900 text-slate-100">हिन्दी (Hindi)</option>
                <option value="Kannada" className="bg-slate-900 text-slate-100">கன்னட (Kannada)</option>
              </select>
            </div>

            {/* Offline indicator */}
            <div className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Offline Ready</span>
            </div>
          </div>
        </div>

        {/* Screen Content Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* SCREEN 1 — HOME */}
          {screen === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Header card */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-5 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Active Worker Profile</span>
                    <h2 className="text-xl font-black">{workerName}</h2>
                    <p className="text-xs text-slate-300 font-mono">ID: {workerId} · {shift}</p>
                  </div>
                  <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-2 text-center">
                    <span className="block text-[9px] font-bold uppercase text-blue-300">Shift</span>
                    <span className="text-xs font-bold">{shift.split(" ")[0]}</span>
                  </div>
                </div>

                {/* Badge card details */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-900/80 p-3 text-xs border border-slate-700/50">
                  <div>
                    <span className="block text-[10px] text-slate-400">Assigned Badge ID</span>
                    <span className="font-mono font-bold text-blue-300">{badgeId}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Batch ID</span>
                    <span className="font-mono font-bold text-slate-200">{batchId}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Badge Status</span>
                    <span className="font-bold text-emerald-400">✓ VALID</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Pre-Shift Base</span>
                    <span className={`font-bold ${preShiftRecorded ? "text-emerald-400" : "text-amber-400"}`}>
                      {preShiftRecorded ? `✓ Base (${preShiftTime})` : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware Visual Dosimeter */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Assigned Wristband Badge</span>
                  <span className="text-xs font-mono font-bold text-primary">{badgeId}</span>
                </div>
                <WristbandDosimeter badgeId={badgeId} batchId={batchId} exposure={userMeasurements[0]?.exposure} />
              </div>

              {/* Latest recorded exposure card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Post-Shift Cumulative Exposure</span>
                    <div className="mt-1 font-mono text-3xl font-black text-slate-900 dark:text-slate-100">
                      {latestExposure}
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    ✓ Validated
                  </span>
                </div>
              </div>

              {/* PRE-SHIFT & POST-SHIFT ACTION BUTTONS */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                  Shift Exposure Workflow Options
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* PRE-SHIFT BUTTON */}
                  <Button
                    onClick={() => handleStartCapture("pre")}
                    className={`h-14 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                      preShiftRecorded
                        ? "bg-emerald-800 hover:bg-emerald-700 text-white"
                        : "bg-blue-900 hover:bg-blue-800 text-white shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sun className="size-4" />
                      <span>1. PRE-SHIFT</span>
                    </div>
                    <span className="text-[9px] font-normal opacity-90">
                      {preShiftRecorded ? `✓ Base Saved (${preShiftTime})` : "Record Base Color"}
                    </span>
                  </Button>

                  {/* POST-SHIFT BUTTON */}
                  <Button
                    onClick={() => handleStartCapture("post")}
                    disabled={!preShiftRecorded}
                    className={`h-14 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                      !preShiftRecorded
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
                        : "bg-amber-600 hover:bg-amber-500 text-white shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <MoonStar className="size-4" />
                      <span>2. POST-SHIFT</span>
                    </div>
                    <span className="text-[9px] font-normal opacity-90">
                      {!preShiftRecorded ? "Requires Pre-Shift Base" : "Analyze Cumulative Exposure"}
                    </span>
                  </Button>
                </div>

                {!preShiftRecorded && (
                  <p className="text-[11px] text-amber-600 text-center font-semibold dark:text-amber-400">
                    * Please record your Pre-Shift Base Color before starting your shift.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* SCREEN 2 — CAPTURE BADGE */}
          {screen === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="font-bold text-base">
                    {captureMode === "pre" ? "Pre-Shift Base Color Capture" : "Post-Shift Exposure Capture"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {captureMode === "pre" ? "Records unexposed baseline color" : "Compares against Pre-Shift Base Color"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setScreen(1)}>Back</Button>
              </div>

              {/* Mode indicator banner */}
              <div className={`rounded-xl p-3 text-xs font-bold flex items-center gap-2 ${
                captureMode === "pre" ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200" : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
              }`}>
                {captureMode === "pre" ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
                <span>
                  {captureMode === "pre"
                    ? "Step 1: Capturing pristine dosimeter color BEFORE starting work shift."
                    : "Step 2: Capturing dosimeter color AFTER work shift to calculate cumulative dose."}
                </span>
              </div>

              {/* Wristband Hardware Display with Alignment frame */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-4 text-center text-white min-h-[300px] flex flex-col items-center justify-center">
                <div className="absolute inset-4 rounded-xl border-2 border-dashed border-blue-400/60 pointer-events-none flex items-center justify-center">
                  <span className="absolute top-2 left-3 bg-slate-900/90 px-2 py-0.5 text-[9px] font-bold text-blue-300 rounded">
                    BADGE ALIGNMENT FRAME
                  </span>
                </div>

                <WristbandDosimeter badgeId={badgeId} batchId={batchId} exposure={captureMode === "pre" ? 0 : 2.1} />

                <p className="mt-2 text-xs font-semibold text-blue-200 bg-slate-900/80 px-3 py-1 rounded-full">
                  Place the complete badge inside the frame
                </p>
              </div>

              {/* Validation indicators */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Good lighting
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Reference visible
                </div>
              </div>

              {/* CAPTURE BUTTON */}
              <Button
                onClick={handleExecuteCapture}
                className={`w-full h-13 rounded-xl text-white font-bold text-base shadow-md ${
                  captureMode === "pre" ? "bg-blue-900 hover:bg-blue-800" : "bg-amber-600 hover:bg-amber-500"
                }`}
              >
                CAPTURE {captureMode === "pre" ? "PRE-SHIFT BASE" : "POST-SHIFT EXPOSURE"}
              </Button>
            </motion.div>
          )}

          {/* SCREEN 3 — IMAGE VALIDATION */}
          {screen === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="text-center py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {captureMode === "pre" ? "Pre-Shift Validation" : "Post-Shift Quantification"}
                </span>
                <h3 className="text-lg font-bold">Validating Badge</h3>
                <p className="text-xs text-muted-foreground">Normalizing color response against reference palette</p>
              </div>

              {/* Checklist */}
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {[
                  "Badge detected",
                  "Sensing region detected",
                  "Reference region detected",
                  "Image quality acceptable",
                  "Badge validity confirmed",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs font-semibold p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className={`grid size-5 place-items-center rounded-full text-xs ${validationDone.includes(item) ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-700"}`}>
                      {validationDone.includes(item) ? <Check className="size-3" /> : "•"}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Colour normalization visual comparison */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block mb-2">
                  {captureMode === "pre" ? "Pre-Shift Base Color Extraction" : "Pre/Post Shift Delta Analysis"}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-center">
                    <div className="size-10 rounded-lg bg-[#B2A28C] border border-slate-400 mx-auto shadow-inner" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-1">Pre-Shift Base</span>
                  </div>
                  <ArrowLeftRight className="size-4 text-blue-500" />
                  <div className="text-center">
                    <div className="size-10 rounded-lg bg-[#695546] border border-slate-400 mx-auto shadow-inner" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-1">Post-Shift Color</span>
                  </div>
                  <ArrowRight className="size-4 text-blue-500" />
                  <div className="text-center">
                    <div className="size-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-[9px] font-bold mx-auto">
                      CAL-03
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-1">Model</span>
                  </div>
                </div>
              </div>

              <Button
                disabled={isProcessing}
                onClick={() => setScreen(4)}
                className="w-full h-12 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold"
              >
                {isProcessing ? "Validating Image..." : "View Exposure Analysis Result →"}
              </Button>
            </motion.div>
          )}

          {/* SCREEN 4 — MEASUREMENT RESULT */}
          {screen === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="border-b pb-2">
                <span className="text-xs font-bold uppercase text-blue-600">Post-Shift Quantification</span>
                <h3 className="text-lg font-bold">Measurement Result</h3>
              </div>

              {/* Large Central Result Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Calculated Cumulative Shift Exposure</span>
                <div className="mt-2 font-mono text-5xl font-black text-slate-900 dark:text-slate-100">
                  {currentResult?.exposure !== null ? `${currentResult?.exposure?.toFixed(1)}` : "0.0"} <span className="text-xl font-bold">ppm·h</span>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" /> ✓ Within validated range
                </div>
              </div>

              {/* Comparative Pre vs Post Swatches */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Shift Color Delta Trace</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 block">Pre-Shift Base Color ({currentResult?.preShiftTime || "08:00 AM"})</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="size-6 rounded-md bg-[#B2A28C] border border-slate-400" />
                      <span className="font-mono text-[10px] font-bold">RGB 178/162/140</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 block">Post-Shift Color ({currentResult?.postShiftTime || "04:30 PM"})</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="size-6 rounded-md bg-[#695546] border border-slate-400" />
                      <span className="font-mono text-[10px] font-bold">RGB 105/85/70</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setScreen(5)}>
                  Explain Measurement
                </Button>
                <Button className="flex-1 bg-blue-900 hover:bg-blue-800 text-white" onClick={handleSaveMeasurement}>
                  Save Exposure Record
                </Button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 5 — EXPLAIN MEASUREMENT */}
          {screen === 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="font-bold text-base">Explain Measurement</h3>
                  <p className="text-xs text-muted-foreground">Traceability Flow Breakdown</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setScreen(4)}>Back</Button>
              </div>

              {/* Traceability Flow */}
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {[
                  "Pre-Shift Base Color Capture",
                  "Post-Shift Color Capture",
                  "Image Quality & Fixture Check",
                  "Reference Palette Normalization",
                  "Delta ΔE Extraction vs Pre-Shift Base",
                  "Calibration Model (CAL-03)",
                  "Cumulative Exposure Estimation",
                ].map((step, idx, arr) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold dark:bg-slate-800/60">
                      <span>{step}</span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        ✓ Validated
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="text-center font-bold text-blue-500 text-xs py-0.5">↓</div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button onClick={() => setScreen(4)} className="w-full bg-blue-900 text-white">
                Back to Result
              </Button>
            </motion.div>
          )}

          {/* SCREEN 6 — EXPOSURE HISTORY */}
          {screen === 6 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-base">Shift Exposure History</h3>
                <span className="text-xs font-mono font-bold text-muted-foreground">{userMeasurements.length} Records</span>
              </div>

              {userMeasurements.length === 0 ? (
                <div className="py-10 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                  <History className="mx-auto size-10 text-slate-400 mb-2" />
                  <div className="font-bold text-sm">No post-shift exposure records saved yet</div>
                  <p className="text-xs text-muted-foreground mt-1">Record Pre-Shift and Post-Shift captures to log exposure.</p>
                  <Button className="mt-4 bg-blue-900 text-white" size="sm" onClick={() => setScreen(1)}>
                    Go to Shift Options
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {userMeasurements.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{m.timestamp}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          ID: {m.id} · Pre: {m.preShiftTime || "08:00 AM"} · Post: {m.postShiftTime || m.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-black text-slate-900 dark:text-slate-100">
                          {m.exposure !== null ? `${m.exposure} ppm·h` : "—"}
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${m.status === "VALID" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800"}`}>
                          {m.status === "VALID" ? "✓ Valid" : "⚠ Review"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN 7 — MULTILINGUAL HSE ASSISTANT */}
          {screen === 7 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[520px] justify-between">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-blue-600" />
                    <h3 className="font-bold text-base">HSE Assistant</h3>
                  </div>

                  <div className="flex gap-1 text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                    {["English", "தமிழ்", "हिन्दी", "கன்னட"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-2 py-0.5 rounded ${language === lang ? "bg-white text-blue-900 dark:bg-slate-900 dark:text-blue-300 shadow-xs" : "text-slate-600 dark:text-slate-400"}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-[11px] text-blue-950 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200 mb-3">
                  <Info className="inline size-3.5 mr-1 text-blue-600" />
                  <b>Approved Knowledge Base:</b> Assistant explains pre/post shift quantitative measurements & site procedures.
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-xs ${msg.sender === "user" ? "bg-blue-900 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
                  <button
                    onClick={() => handleSendChatMessage("What does my result mean?")}
                    className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300"
                  >
                    “What does my result mean?”
                  </button>
                  <button
                    onClick={() => handleSendChatMessage("What action is required?")}
                    className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    “What action is required?”
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    placeholder="Ask HSE question..."
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none"
                  />
                  <Button onClick={() => handleSendChatMessage()} size="icon" className="rounded-xl bg-blue-900 text-white">
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Mobile Navigation */}
        <div className="grid grid-cols-4 border-t border-slate-200 bg-white p-2 text-center text-[10px] font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <button
            onClick={() => { setScreen(1); setActiveTab("Home"); }}
            className={`flex flex-col items-center gap-1 py-1 ${screen === 1 ? "text-blue-600 dark:text-blue-400" : ""}`}
          >
            <Home className="size-4" /> Home
          </button>
          <button
            onClick={() => { setScreen(6); setActiveTab("History"); }}
            className={`flex flex-col items-center gap-1 py-1 ${screen === 6 ? "text-blue-600 dark:text-blue-400" : ""}`}
          >
            <History className="size-4" /> History
          </button>
          <button
            onClick={() => { setScreen(7); setActiveTab("Guide"); }}
            className={`flex flex-col items-center gap-1 py-1 ${screen === 7 ? "text-blue-600 dark:text-blue-400" : ""}`}
          >
            <Sparkles className="size-4" /> Assistant
          </button>
          <button
            onClick={() => { setScreen(1); setActiveTab("Profile"); toast("Logged in as " + workerName); }}
            className={`flex flex-col items-center gap-1 py-1 ${activeTab === "Profile" ? "text-blue-600 dark:text-blue-400" : ""}`}
          >
            <User className="size-4" /> Profile
          </button>
        </div>

      </div>
    </div>
  );
}
