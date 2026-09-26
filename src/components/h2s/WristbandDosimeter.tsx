import React from "react";
import { cn } from "@/lib/utils";
import { evaluateBadgeShelfLife, type BadgeShelfLifeStatus } from "@/lib/badgeUtils";

interface WristbandDosimeterProps {
  badgeId?: string | undefined;
  batchId?: string | undefined;
  expiryStr?: string | undefined;
  shelfLifeStatus?: BadgeShelfLifeStatus | undefined;
  exposure?: number | null | undefined;
  className?: string | undefined;
  compact?: boolean | undefined;
}

export function WristbandDosimeter({
  badgeId = "B-00101",
  batchId = "BATCH-01",
  expiryStr = "12 Jan 2027",
  shelfLifeStatus,
  exposure = 0,
  className,
  compact = false,
}: WristbandDosimeterProps) {
  // Determine shelf life status if not directly provided
  const effectiveShelfLife = shelfLifeStatus || evaluateBadgeShelfLife(expiryStr);

  // Shelf life indicator color & label configuration
  // Green (#22c55e) = Valid, Yellow (#eab308) = Expiring Soon, Red (#ef4444) = Expired / Invalid
  const shelfConfig = React.useMemo(() => {
    switch (effectiveShelfLife) {
      case "EXPIRING SOON":
        return {
          dotBg: "bg-yellow-500",
          glowColor: "shadow-[0_0_12px_rgba(234,179,8,0.8)]",
          label: "SHELF EXPIRING",
          textColor: "text-yellow-400",
          ringBorder: "border-yellow-400/60",
        };
      case "INVALID":
        return {
          dotBg: "bg-red-500",
          glowColor: "shadow-[0_0_12px_rgba(239,68,68,0.9)]",
          label: "SHELF EXPIRED",
          textColor: "text-red-400",
          ringBorder: "border-red-500/60",
        };
      case "VALID":
      default:
        return {
          dotBg: "bg-emerald-500",
          glowColor: "shadow-[0_0_12px_rgba(34,197,94,0.8)]",
          label: "SHELF VALID",
          textColor: "text-emerald-400",
          ringBorder: "border-emerald-500/60",
        };
    }
  }, [effectiveShelfLife]);

  // Color calculation based on H2S exposure level (0 to 5 ppm*h)
  const expVal = Math.min(5, Math.max(0, exposure || 0));
  const r = Math.round(212 - expVal * 25);
  const g = Math.round(185 - expVal * 24);
  const b = Math.round(130 - expVal * 18);
  const sensorBg = `rgb(${r}, ${g}, ${b})`;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-2.5 shadow-md text-white", className)}>
        <div className="relative grid size-12 shrink-0 place-items-center rounded-lg border border-slate-700 bg-slate-950 shadow-inner">
          {/* Central sensor representation */}
          <div
            className="size-6 rounded-full border-2 border-white shadow-sm transition-colors duration-500"
            style={{ backgroundColor: sensorBg }}
          />
          {/* Mini right-side shelf indicator dot */}
          <div className={cn("absolute right-1 top-1 size-2.5 rounded-full border border-slate-900", shelfConfig.dotBg, shelfConfig.glowColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-white">{badgeId}</span>
            <span className={cn("text-[9px] font-bold px-1.5 py-0.2 rounded border", shelfConfig.textColor, shelfConfig.ringBorder)}>
              {effectiveShelfLife}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{batchId} · SentraBand H₂S Dosimeter</div>
        </div>
      </div>
    );
  }

  // 12 Palette Reference Dots matching SentraBand faceplate
  const referencePalette = [
    { label: "R1", color: "#FFFFFF", textDark: true },
    { label: "R2", color: "#E2E8F0", textDark: true },
    { label: "R3", color: "#94A3B8", textDark: true },
    { label: "R4", color: "#64748B", textDark: false },
    { label: "R5", color: "#475569", textDark: false },
    { label: "R6", color: "#334155", textDark: false },
    { label: "R7", color: "#1E293B", textDark: false },
    { label: "R8", color: "#0F172A", textDark: false },
    { label: "R9", color: "#EF4444", textDark: false },
    { label: "R10", color: "#22C55E", textDark: false },
    { label: "R11", color: "#3B82F6", textDark: false },
    { label: "R12", color: "#EAB308", textDark: true },
  ];

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-2", className)}>
      {/* SentraBand H2S Dosimeter Main Square Badge Body */}
      <div className="relative w-72 sm:w-80 aspect-square rounded-3xl bg-[#131b2e] border-4 border-slate-700/80 shadow-2xl p-4 flex flex-col items-center justify-between select-none overflow-hidden">
        
        {/* Top Header Label */}
        <div className="w-full text-center z-10">
          <h4 className="text-[11px] font-black tracking-widest text-slate-300 font-mono uppercase">
            SENTRABAND H₂S DOSIMETER
          </h4>
        </div>

        {/* 4 Corner ArUco Fiducial Markers */}
        {/* Top-Left ArUco */}
        <div className="absolute top-3 left-3 size-10 bg-white p-1 rounded-sm border border-black shadow-md flex items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 size-full bg-white gap-0.5 p-0.5">
            <div className="bg-black col-span-1 row-span-1" />
            <div className="bg-black col-span-2 row-span-1" />
            <div className="bg-white col-span-1 row-span-1" />
            <div className="bg-black col-span-1 row-span-1" />
            <div className="bg-black col-span-1 row-span-1" />
            <div className="bg-black col-span-2 row-span-1" />
          </div>
        </div>

        {/* Top-Right ArUco */}
        <div className="absolute top-3 right-3 size-10 bg-white p-1 rounded-sm border border-black shadow-md flex items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 size-full bg-white gap-0.5 p-0.5">
            <div className="bg-black col-span-2 row-span-1" />
            <div className="bg-white col-span-1 row-span-1" />
            <div className="bg-black col-span-1 row-span-1" />
            <div className="bg-black col-span-1 row-span-1" />
            <div className="bg-white col-span-1 row-span-1" />
            <div className="bg-black col-span-2 row-span-1" />
          </div>
        </div>

        {/* Bottom-Left ArUco */}
        <div className="absolute bottom-3 left-3 size-10 bg-white p-1 rounded-sm border border-black shadow-md flex items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 size-full bg-white gap-0.5 p-0.5">
            <div className="bg-black col-span-1 row-span-2" />
            <div className="bg-white col-span-1 row-span-1" />
            <div className="bg-black col-span-1 row-span-1" />
            <div className="bg-black col-span-2 row-span-1" />
            <div className="bg-black col-span-1 row-span-1" />
          </div>
        </div>

        {/* Bottom-Right ArUco */}
        <div className="absolute bottom-3 right-3 size-10 bg-white p-1 rounded-sm border border-black shadow-md flex items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 size-full bg-white gap-0.5 p-0.5">
            <div className="bg-black col-span-3 row-span-1" />
            <div className="bg-white col-span-1 row-span-1" />
            <div className="bg-black col-span-2 row-span-1" />
            <div className="bg-black col-span-1 row-span-1" />
          </div>
        </div>

        {/* Central Ring Container: 12 Palette Dots + Center Sensing Region */}
        <div className="relative size-52 sm:size-56 my-auto grid place-items-center">
          
          {/* Radial 12 Palette Dots (R1 to R12) */}
          {referencePalette.map((p, idx) => {
            // Angle starting from R1 at 12 o'clock (-90 degrees)
            const angle = (idx * 30 - 90) * (Math.PI / 180);
            const radius = 88; // radius in pixels
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <div
                key={p.label}
                className="absolute grid size-6 place-items-center rounded-full border-2 border-slate-700 text-[8px] font-mono font-black shadow-md"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  backgroundColor: p.color,
                  color: p.textDark ? "#0f172a" : "#ffffff",
                }}
                title={`Reference Patch ${p.label}`}
              >
                {p.label}
              </div>
            );
          })}

          {/* RIGHT SIDE DYNAMIC SHELF LIFE INDICATOR DOT & LABEL (Next to R4) */}
          <div
            className="absolute flex flex-col items-center justify-center gap-1 z-20"
            style={{
              transform: "translate(112px, 18px)", // positioned right side next to R4
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Pulsing Aura Ring */}
              <span className={cn("absolute size-6 rounded-full opacity-60 animate-ping", shelfConfig.dotBg)} />
              {/* Main Indicator Dot with Metallic Ring */}
              <div
                className={cn(
                  "size-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-500",
                  shelfConfig.dotBg,
                  shelfConfig.glowColor
                )}
              >
                <div className="size-1.5 rounded-full bg-white/90" />
              </div>
            </div>
            <span className={cn("text-[7px] font-mono font-black uppercase tracking-tighter whitespace-nowrap drop-shadow-md", shelfConfig.textColor)}>
              {shelfConfig.label}
            </span>
          </div>

          {/* Central H2S Sensing Region (ROI-A) */}
          <div className="relative grid size-28 sm:size-32 place-items-center rounded-full border-4 border-white bg-slate-900 shadow-2xl z-10">
            {/* Transparent Gloss Overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Reactive Chemical Patch */}
            <div
              className="size-24 sm:size-28 rounded-full shadow-inner transition-colors duration-700 flex flex-col items-center justify-center text-center p-1"
              style={{ backgroundColor: sensorBg }}
            >
              <span className="text-[10px] font-black text-slate-900 tracking-tight uppercase">H₂S SENSOR</span>
              <span className="text-[9px] font-mono font-bold text-slate-800">
                {exposure != null ? `${exposure.toFixed(1)} ppm·h` : "0.0 ppm·h"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Badge Identification Bar */}
        <div className="w-full flex items-center justify-between px-2 text-[9px] font-mono font-bold text-slate-400 z-10 border-t border-slate-800/80 pt-1.5">
          <span>BADGE: <b className="text-white">{badgeId}</b></span>
          <span>BATCH: <b className="text-slate-200">{batchId}</b></span>
        </div>
      </div>

      {/* Dynamic Hardware & Verification Status Footer Caption */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1 font-bold text-primary">
          <span className="size-2 rounded-full bg-blue-500" /> SentraBand Faceplate
        </span>
        <span>•</span>
        <span>R1–R12 Palette</span>
        <span>•</span>
        <span className={cn("flex items-center gap-1.5 font-black px-2 py-0.5 rounded border", shelfConfig.textColor, shelfConfig.ringBorder)}>
          <span className={cn("size-2 rounded-full", shelfConfig.dotBg)} /> Right Dot: {effectiveShelfLife}
        </span>
      </div>
    </div>
  );
}

