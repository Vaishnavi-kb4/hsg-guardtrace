import React from "react";
import { cn } from "@/lib/utils";

interface WristbandDosimeterProps {
  badgeId?: string | undefined;
  batchId?: string | undefined;
  exposure?: number | null | undefined;
  className?: string | undefined;
  compact?: boolean | undefined;
}

export function WristbandDosimeter({
  badgeId = "B-00101",
  batchId = "BATCH-01",
  exposure = 0,
  className,
  compact = false,
}: WristbandDosimeterProps) {
  // Color calculation based on H2S exposure level (0 to 5 ppm*h)
  // Higher exposure causes color shift from light buff/tan to darker brownish silver
  const expVal = Math.min(5, Math.max(0, exposure || 0));
  const r = Math.round(180 - expVal * 15);
  const g = Math.round(165 - expVal * 16);
  const b = Math.round(140 - expVal * 14);
  const sensorBg = `rgb(${r}, ${g}, ${b})`;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 rounded-lg border border-border bg-card p-2.5", className)}>
        <div className="relative grid size-12 shrink-0 place-items-center rounded-full border-2 border-slate-700 bg-slate-900 shadow-sm">
          {/* Reference ring */}
          <div className="absolute inset-1 rounded-full border border-dashed border-slate-500" />
          {/* Sensor center */}
          <div
            className="size-6 rounded-full border border-slate-400 shadow-inner transition-colors duration-500"
            style={{ backgroundColor: sensorBg }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-xs font-bold text-foreground">{badgeId}</div>
          <div className="text-[10px] text-muted-foreground">{batchId} · Passive Dosimeter</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-4", className)}>
      {/* Strap Left and Right */}
      <div className="relative flex items-center justify-center w-full max-w-sm">
        {/* Horizontal Strap */}
        <div className="absolute h-14 w-full rounded-md bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-y border-slate-600 shadow-md flex justify-between items-center px-4">
          <div className="flex gap-1.5 opacity-40">
            <span className="h-8 w-1 bg-slate-900 rounded" />
            <span className="h-8 w-1 bg-slate-900 rounded" />
            <span className="h-8 w-1 bg-slate-900 rounded" />
          </div>
          <div className="flex gap-1.5 opacity-40">
            <span className="h-8 w-1 bg-slate-900 rounded" />
            <span className="h-8 w-1 bg-slate-900 rounded" />
            <span className="h-8 w-1 bg-slate-900 rounded" />
          </div>
        </div>

        {/* Circular Dosimeter Housing */}
        <div className="relative z-10 grid size-44 place-items-center rounded-full border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl">
          {/* Metallic ring */}
          <div className="relative grid size-full place-items-center rounded-full border-2 border-slate-600 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 p-2 shadow-inner dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">

            {/* Printed Reference Color Scale Ring around Sensing Region */}
            <div className="absolute inset-3 rounded-full border border-slate-400/50 flex items-center justify-center">
              {/* Palette dots positioned radially */}
              {[
                { label: "R0", color: "#E2D9C5" },
                { label: "R1", color: "#C4B69C" },
                { label: "R2", color: "#A79577" },
                { label: "R3", color: "#8A7555" },
                { label: "R4", color: "#6F5736" },
                { label: "R5", color: "#543C1D" },
              ].map((p, idx) => {
                const angle = (idx * 60 - 90) * (Math.PI / 180);
                const radius = 54;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div
                    key={p.label}
                    className="absolute grid size-4 place-items-center rounded-full border border-slate-700 text-[7px] font-mono font-bold text-slate-900 shadow-xs"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      backgroundColor: p.color,
                    }}
                    title={`Ref ${p.label}`}
                  />
                );
              })}
            </div>

            {/* Central H2S Sensing Region */}
            <div className="relative grid size-20 place-items-center rounded-full border-2 border-slate-500 bg-slate-100 p-1 shadow-inner">
              {/* Transparent Membrane Gloss */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />

              {/* Reactive Chemical Sensor Patch */}
              <div
                className="size-16 rounded-full border border-slate-400 shadow-inner transition-colors duration-700 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: sensorBg }}
              >
                <span className="text-[9px] font-bold text-slate-800 tracking-tight">H₂S ROI</span>
                <span className="text-[8px] font-mono font-black text-slate-900">
                  {exposure != null ? `${exposure.toFixed(1)} ppm·h` : "0.0 ppm·h"}
                </span>
              </div>
            </div>

            {/* Product labels */}
            <div className="absolute bottom-2 text-center">
              <span className="text-[7px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                H₂S GUARD DOSIMETER
              </span>
            </div>
            <div className="absolute top-2 font-mono text-[7px] font-bold text-slate-700 dark:text-slate-300">
              {badgeId} · {batchId}
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Specs Caption */}
      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1 font-semibold text-primary">
          <span className="size-2 rounded-full bg-emerald-500" /> Circular Sensing Region
        </span>
        <span>•</span>
        <span>Reference Palette Ring</span>
        <span>•</span>
        <span className="font-mono text-xs font-bold text-foreground">{badgeId}</span>
      </div>
    </div>
  );
}
