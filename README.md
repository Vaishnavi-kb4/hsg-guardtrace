# 🛡️ H₂S Guard Trace — Industrial Passive Gas Dosimetry & Exposure System

> **A Next-Generation Industrial HSE (Health, Safety & Environment) Passive Gas Exposure Dosimeter & Traceability Platform.**
>
> Combines real-time optical pixel color analysis, right-side badge shelf life evaluation, multi-ROI pixel extraction, automated exposure calculations (Cumulative Dose & Shift TWA), multilingual AI safety assistant (5 languages), and cross-platform mobile access via Expo Go and Web.

---

## ✨ Core Features

### 1. 🏷️ Right-Side Optical Badge Shelf Life Evaluation (ROI-D)
- Automatically inspects the right-side optical indicator dot on dosimeter badges.
- Quantifies median RGB/HSV channels to classify shelf life validity:
  - **🟢 GREEN (VALID & SAFE):** Badge shelf life is valid. Safe for work shift.
  - **🟡 YELLOW (EXPIRING SOON < 30 DAYS):** Expiring within 30 days. Batch renewal requested.
  - **🔴 RED (EXPIRED & INVALID):** Badge is expired and invalid. Immediate replacement required.
- Enforces strict safety controls in Pre-Shift scans before workers enter hazardous plant zones.

---

### 2. 📸 Pre-Shift & Post-Shift Guided Dosimetry Workflow
- **Step 1 — Pre-Shift Baseline Scan:**
  - Captures uploaded or live camera photograph of the assigned badge.
  - Extracts baseline RGB values (`218/208/192`) and validates optical indicator dot shelf life.
  - Requires explicit worker acknowledgment of baseline values before closing.
- **Step 2 — Post-Shift Exposure Calculation:**
  - Measures post-shift color transition ($\Delta E$ CIEDE2000).
  - Computes **Cumulative Exposure Dose** ($D$ in $\text{ppm}\cdot\text{h}$) and 8-hour **Shift Time-Weighted Average** ($\text{TWA}$ in $\text{ppm}$).
- **🚨 High Exposure Hazard Alert:**
  - Automatically triggers an emergency alert modal with device vibration when shift TWA exceeds $2.50\text{ ppm}$.

---

### 3. 🌍 5-Language Multilingual UI & AI Assistant
- Complete multilingual support across **English**, **தமிழ் (Tamil)**, **हिंदी (Hindi)**, **ಕನ್ನಡ (Kannada)**, and **മലയാളം (Malayalam)**.
- Integrated AI Safety Assistant capable of answering exposure questions, threshold limits, and worker trace history in all 5 languages.

---

### 4. 📱 Mobile Expo & Public Connection Support
- Lightweight native React Native / Expo container in `index.js`.
- Integrated 100% offline SVG QR code generator (`LocalQrCode.tsx`) for instant mobile device scanning.
- Zero-403 tunnel support (`vite.config.ts` configured with `allowedHosts: true`).

---

### 5. 📊 Occupational Compliance & Traceability Log
- Includes explicit `Validity of Shelf Life` column across all personal and plant-wide exposure history logs.
- Export options for CSV and PDF compliance reports.

---

## 🏗️ Technology Stack

- **Core Framework:** React 19, TypeScript, Vite 6, TanStack Router & Query
- **Mobile Container:** Expo 57, React Native 0.86, React Native WebView, Safe Area Context
- **UI & Styling:** Tailwind CSS v4, Lucide Icons, Radix UI Primitives, Framer Motion
- **Color Engine:** Custom HTML5 Canvas Pixel Extractor (`imageAnalysisEngine.ts`), CIEDE2000 $\Delta E$ Color Distance Model (`calibrationEngine.ts`)

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Vaishnavi-kb4/hsg-guardtrace.git
cd hsg-guardtrace
npm install
```

### 2. Run Web Application
Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 3. Run Mobile Expo App
Start the Metro bundler for Expo Go:
```bash
npm run expo:start
```
Scan the Metro QR code or enter `exp://<YOUR-IP>:8082` in **Expo Go** on your iOS / Android device.

---

## 📜 Repository Structure

```text
src/
├── components/
│   ├── h2s/
│   │   ├── WorkerDashboard.tsx         # Pre & Post shift worker workflow & modals
│   │   ├── SafetyMonitorDashboard.tsx  # HSE Officer plant overview & compliance
│   │   ├── LocalQrCode.tsx             # Offline SVG QR generator
│   │   └── AuthDialog.tsx              # Multi-role authentication modal
├── services/
│   ├── imageAnalysisEngine.ts          # ROI-D dot & RGB optical pixel analyzer
│   ├── calibrationEngine.ts            # CIEDE2000 ΔE exposure quantification
│   └── multilingualAssistant.ts        # 5-language AI safety assistant
├── lib/
│   ├── badgeUtils.ts                   # Optical shelf life status classifier
│   └── translations.ts                # 5-language UI translation dictionary
index.js                                # Native Expo mobile entry point
vite.config.ts                          # Vite server & allowedHosts configuration
```

---

## 🛡️ License

Developed for Industrial Health, Safety & Environment (HSE) Passive Gas Dosimetry & Exposure Traceability.
