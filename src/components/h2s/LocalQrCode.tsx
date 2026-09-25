import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface LocalQrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function LocalQrCode({ value, size = 220, className = "" }: LocalQrCodeProps) {
  return (
    <div className={`inline-flex items-center justify-center p-3 bg-white rounded-2xl border-4 border-blue-500/30 shadow-inner ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#0f172a"
        level="H"
        marginSize={2}
      />
    </div>
  );
}
