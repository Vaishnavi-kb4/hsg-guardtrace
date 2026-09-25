# H₂S Guard Dashboard

Build a complete, polished, production-style frontend for an industrial H₂S Passive Exposure Dosimeter system called:

"H2S GUARD"

This is an HSE (Health, Safety & Environment) software system connected to a passive chemical sensing wristband/dosimeter.

IMPORTANT:

This is NOT a generic AI dashboard.

The UI must look like a professional industrial safety, chemical exposure monitoring and measurement system.

The software workflow is:

WEAR

→ CAPTURE

→ VALIDATE

→ NORMALIZE

→ ESTIMATE

→ EXPLAIN

→ RECORD

→ REVIEW

The physical wristband changes color based on H₂S exposure.

The mobile application captures an image of the wristband.

Computer vision validates the image.

The sensing region and reference color palette are detected.

Color is normalized.

A calibration/ML engine estimates cumulative exposure.

The result is stored as a traceable measurement.

The HSE dashboard allows safety officers to review workers, measurements, badges, calibration and alerts.

Build ONLY THE FRONTEND for now.

Use realistic mock data and simulated processing.

Every important button must actually work.

Do not create dead buttons.

==================================================

TECH STACK

==================================================

Use:

- React

- Vite

- TypeScript

- Tailwind CSS

- React Router

- Lucide React icons

- Recharts for charts

- Framer Motion for subtle animations

- LocalStorage for demo persistence

Do not require a backend.

Create a clean component architecture.

Suggested structure:

src/

  components/

  pages/

  layouts/

  data/

  hooks/

  utils/

  types/

  App.tsx

==================================================

DESIGN DIRECTION

==================================================

Visual identity:

Industrial + scientific + modern HSE technology.

Avoid:

- Generic SaaS purple gradients

- Excessive glassmorphism

- Neon gaming UI

- Cryptocurrency-style dashboards

- Overly colorful cards

- Generic chatbot appearance

Use:

- Deep navy / charcoal text

- Off-white background

- Cool blue

- Teal

- Safety amber

- Safety red

- Controlled green

- Subtle steel/industrial gray

- Thin borders

- Rounded 12–16px cards

- Strong typography

- Large measurement numbers

- Technical data labels

- Small status indicators

- Clean charts

- Professional spacing

The interface should look suitable for:

- refinery

- chemical plant

- industrial workplace

- HSE control room

- safety officer

- field worker

Use a visual language inspired by industrial control systems and modern medical/scientific interfaces.

==================================================

GLOBAL APP LAYOUT

==================================================

Create a desktop dashboard layout with:

LEFT SIDEBAR

Logo:

"H₂S GUARD"

Subtitle:

"Passive Exposure Monitoring"

Navigation:

1. Overview

2. Capture

3. Measurements

4. Workers

5. Badges

6. Calibration

7. Alerts & Review

8. Reports

9. HSE Assistant

10. Settings

Bottom of sidebar:

System Status

● Local Processing Ready

● Sync Available

User profile:

"HSE Officer"

"MRPL SRU Unit 09"

Top navigation:

- Current plant/unit

- Shift selector

- Search

- Notifications

- User profile

On mobile, convert sidebar into a bottom navigation / slide-out menu.

==================================================

PAGE 1 — OVERVIEW

==================================================

Create a professional HSE control-room dashboard.

Header:

"Exposure Monitoring"

Subtitle:

"Real-time overview of passive H₂S exposure measurements"

Top KPI cards:

1. Active Workers

Example: 128

2. Measurements Today

Example: 86

3. Valid Measurements

Example: 81

4. Review Required

Example: 5

5. Invalid Captures

Example: 3

6. Badges Expiring

Example: 7

Do NOT present these as real-world claims.

Clearly use demo/mock data.

Main section:

"Exposure Overview"

Create a line/bar chart showing exposure measurements across shifts/hours.

Example mock data:

06:00

08:00

10:00

12:00

14:00

16:00

Use a clean scientific chart.

Next section:

"Recent Measurements"

Table columns:

Measurement ID

Worker

Badge

Shift

Exposure

Status

Captured

Action

Example:

MEAS-1042

W-102

B-00125

Morning

2.1 ppm·h

Valid

10:42

View

MEAS-1041

W-103

B-00131

Morning

—

Invalid

10:31

Review

Each row's View button must open the measurement detail page/modal.

Next:

"Review Queue"

Cards for:

- Image quality failure

- Expired badge

- Outside validated range

- Manual HSE review

Each has:

[Review]

==================================================

PAGE 2 — WORKER CAPTURE

==================================================

This is one of the MOST IMPORTANT screens.

Create a dedicated capture workflow.

Header:

"Capture Exposure Reading"

Show a horizontal workflow indicator:

01 CAPTURE

→

02 VALIDATE

→

03 NORMALIZE

→

04 ESTIMATE

→

05 REVIEW

Main area should resemble a professional camera/scanning interface.

Left/main panel:

"Position the dosimeter inside the capture frame"

Create a large capture area with:

- Dashed scanning frame

- Wristband placeholder illustration

- ARUCO marker indicators

- Sensing region indicator

- Reference color palette indicator

Display instructions:

"Ensure the sensing region and reference palette are visible."

Buttons:

[ Capture Image ]

[ Upload Image ]

[ Use Demo Capture ]

The buttons MUST WORK.

==================================================

CAPTURE INTERACTION

==================================================

When "Capture Image" is clicked:

Open browser camera if available.

If camera unavailable:

show a clean fallback message and provide:

[ Upload Image ]

When image is selected:

Show image preview.

Buttons:

[ Retake ]

[ Validate Image ]

==================================================

DEMO CAPTURE

==================================================

"Use Demo Capture" should load a predefined sample wristband image/state.

Then automatically move to validation.

Do NOT claim that this simulated result is a real H₂S measurement.

Display:

"DEMO MODE"

==================================================

PAGE 3 — IMAGE VALIDATION

==================================================

After capture, show:

"Image Validation"

Create a visual validation checklist.

Checks:

✓ Badge detected

✓ Sensing region detected

✓ Reference palette detected

✓ Lighting acceptable

✓ Sharpness acceptable

✓ Glare within acceptable range

Animate checks sequentially.

Show:

Image Quality Score

Example: 94%

Use a circular progress indicator.

Right panel:

"Validation Summary"

Status:

VALID

Checks:

Badge detected

Reference detected

Lighting acceptable

Sharpness acceptable

Button:

[ Continue to Color Analysis ]

Also provide:

[ Retake Image ]

==================================================

INVALID IMAGE FLOW

==================================================

Add a demo toggle:

"Simulate Invalid Capture"

When enabled, show:

✕

"Image cannot be measured"

Reason:

"Excessive glare"

Message:

"Please recapture the badge with reduced glare."

Button:

[ Retake Image ]

This interaction must work.

==================================================

PAGE 4 — BADGE VALIDATION

==================================================

Create:

"Badge & Calibration Validation"

Show a digital badge identity card.

Badge:

B-00125

Batch:

BATCH-07

Manufactured:

Demo date

Expiry:

Demo date

Calibration:

CAL-03

Status:

VALID

Checklist:

✓ Badge recognized

✓ Batch identified

✓ Within shelf life

✓ Calibration available

Important distinction:

"Badge validity" is different from "measurement validity".

Add a button:

[ Continue ]

Also create a demo "Expired Badge" state.

If expired:

Status:

INVALID

Message:

"This badge is outside its defined shelf-life validity."

Button:

[ Replace Badge ]

==================================================

PAGE 5 — COLOR NORMALIZATION

==================================================

Create a scientific computer-vision interface.

Header:

"Color Normalization"

Show uploaded wristband image.

Overlay visual bounding boxes around:

1. Sensing Region

2. Reference Color Palette

3. ARUCO Fiducial Markers

Use labels:

"SENSING ROI"

"REFERENCE ROI"

"FIDUCIAL MARKER"

Right side:

"Color Analysis"

Raw RGB

R: 105

G: 85

B: 70

Normalized Color

Show a visual color swatch.

Reference Palette:

Display multiple color chips.

Show:

Lighting compensation

White balance correction

Reference normalization

Each item should animate from:

Processing...

to

✓ Complete

Button:

[ Run Color Analysis ]

Then:

[ Continue to Exposure Estimate ]

==================================================

PAGE 6 — AI / CALIBRATION ENGINE

==================================================

Header:

"Exposure Quantification"

Create a technical-looking processing screen.

Show pipeline:

IMAGE

↓

ROI DETECTION

↓

COLOR NORMALIZATION

↓

FEATURE EXTRACTION

↓

CALIBRATION MODEL

↓

EXPOSURE ESTIMATE

When the user clicks:

[ Run Estimation ]

animate the pipeline.

Show technical information:

Calibration Version:

CAL-03

Model:

Demo Calibration Model

Features:

Normalized RGB

HSV

Reference Color Difference

Status:

Within validated range

Then show a large result:

"Estimated Cumulative Exposure"

"2.1 ppm·h"

IMPORTANT:

Label this clearly as:

"DEMO ESTIMATE"

because no real calibration model/backend is connected yet.

Below:

Measurement Confidence:

92% (Demo)

Uncertainty:

Demo value

Do not imply these values are scientifically validated.

Buttons:

[ Explain Result ]

[ Save Measurement ]

==================================================

PAGE 7 — RESULT / EXPLAINABILITY

==================================================

This should be the WOW screen.

Header:

"Measurement Trace"

Large measurement:

2.1 ppm·h

Badge:

VALID

Create a visual traceability timeline:

Physical Dosimeter

↓

Captured Image

↓

Image Validation

↓

Badge Validation

↓

Reference Normalization

↓

Color Feature Extraction

↓

Calibration CAL-03

↓

Exposure Estimate

↓

HSE Review Status

Each node should be clickable.

When clicking a node, show details.

Example:

"Image Validation"

Status:

Passed

Quality Score:

94%

Lighting:

Acceptable

Sharpness:

Acceptable

This page must visually demonstrate:

"Where did this exposure number come from?"

Add:

[ Save Measurement ]

[ Export Record ]

[ Back to Capture ]

==================================================

PAGE 8 — MEASUREMENTS

==================================================

Create a professional measurement history page.

Filters:

Worker

Shift

Badge

Date

Status

Calibration Version

Search box:

"Search measurement ID..."

Table:

Measurement ID

Worker

Badge

Timestamp

Exposure

Calibration

Status

Actions

Actions:

[ View ]

[ Explain ]

[ Export ]

Clicking View opens a detailed drawer.

==================================================

PAGE 9 — MEASUREMENT DETAIL DRAWER

==================================================

Show:

Measurement ID

Worker ID

Shift

Badge ID

Batch ID

Timestamp

Captured Image

Image Quality

Color Features

Calibration Version

Estimated Exposure

Uncertainty

Temperature

Humidity

Badge Validity

Measurement Status

Create a "Traceability" section.

Button:

[ Download Record ]

Button:

[ Mark for HSE Review ]

==================================================

PAGE 10 — WORKERS

==================================================

Create worker management.

Table:

Worker ID

Shift

Badge

Latest Exposure

Last Measurement

Status

Action

Example:

W-102

Morning

B-00125

2.1 ppm·h

10:42

Active

Click worker.

Worker detail:

"Worker W-102"

Show:

Current Shift

Assigned Badge

Exposure History

Measurement Timeline

Recent Captures

Review Flags

Use a line chart for exposure history.

==================================================

PAGE 11 — BADGES

==================================================

Create badge inventory.

Cards:

Active

Expiring Soon

Expired

Calibration Required

Table:

Badge ID

Batch

Worker

Expiry

Calibration

Status

Click badge:

Show:

Badge ID

Batch

Manufacturing Date

Expiry

Calibration Version

Assigned Worker

Measurement Count

Validity History

Button:

[ Assign Badge ]

Button:

[ View Measurements ]

==================================================

PAGE 12 — CALIBRATION

==================================================

Create a technical calibration management page.

Header:

"Calibration & Model Management"

Show:

Current Calibration

CAL-03

Status:

Active

Last Updated:

Demo date

Features:

Normalized RGB

HSV

Color Difference

Create a calibration chart.

X-axis:

Known Exposure

Y-axis:

Color Response

Show mock calibration points and fitted curve.

IMPORTANT:

Clearly label chart:

"Prototype / Demo Calibration Data"

Add:

[ View Calibration Dataset ]

[ Compare Calibration Versions ]

[ Upload Calibration Dataset ]

These buttons should work through modals.

==================================================

PAGE 13 — ALERTS & REVIEW

==================================================

Create:

"Alerts & Review Queue"

Categories:

ALL

IMAGE

BADGE

MEASUREMENT

CALIBRATION

HSE REVIEW

Cards:

1.

"Image quality failure"

Badge B-00131

Reason: Excessive glare

[ Review ]

2.

"Badge expired"

Badge B-00142

[ Review ]

3.

"Outside validated range"

Measurement MEAS-1037

[ Review ]

Clicking Review opens a detailed modal.

Actions:

[ Approve ]

[ Reject ]

[ Request Recapture ]

Buttons must change status.

==================================================

PAGE 14 — REPORTS

==================================================

Create HSE reporting page.

Header:

"Exposure Reports"

Filters:

Date range

Plant unit

Shift

Worker

Badge

Status

Show:

Exposure trend

Valid vs Invalid captures

Review count

Badge usage

Shift comparison

Buttons:

[ Generate Report ]

[ Export CSV ]

[ Export PDF ]

For frontend-only prototype, generate/download a mock CSV.

Show:

"Report generated successfully."

==================================================

PAGE 15 — HSE ASSISTANT

==================================================

Create a professional HSE assistant.

DO NOT make it responsible for calculating exposure.

The assistant should only explain verified data and approved HSE information.

UI:

Header:

"HSE Assistant"

Subtitle:

"Ask about verified measurements and approved safety guidance."

Chat examples:

User:

"What is the latest reading for W-102?"

Assistant:

"Latest recorded demo measurement for W-102 is 2.1 ppm·h. Status: Valid."

User:

"Why was MEAS-1041 rejected?"

Assistant:

"The capture was marked invalid because the image failed the glare/quality validation."

Add suggested questions:

"What is the latest reading?"

"Why was this measurement rejected?"

"Explain this measurement"

"Show badge status"

"Show today's review queue"

The assistant should retrieve information from the mock frontend data.

Do not create random AI answers.

==================================================

PAGE 16 — NOTIFICATION CENTER

==================================================

Create notification dropdown.

Examples:

● Measurement requires HSE review

● Badge B-00142 expires soon

● Invalid capture detected

● Report generated

Click notification → navigate to relevant page.

==================================================

PAGE 17 — SETTINGS

==================================================

Sections:

Plant / Unit

MRPL SRU Unit 09

Shift

Morning

Measurement Settings

Calibration Version

CAL-03

Demo Mode

Toggle ON/OFF

Offline Mode

Toggle ON/OFF

Notification Preferences

Language

English

Tamil

Hindi

Theme

Light

Dark

==================================================

OFFLINE-FIRST UI

==================================================

Create an offline simulation.

Top status indicator:

● ONLINE

If user clicks it:

switch to:

○ OFFLINE

Show:

"Offline mode active"

During offline mode:

Captured measurements are stored locally.

Show:

"3 records pending synchronization"

Button:

[ Sync Now ]

When clicked:

animate synchronization.

Then:

"All records synchronized"

This should use LocalStorage.

==================================================

GLOBAL DEMO DATA

==================================================

Create centralized mock data.

Workers:

W-102

W-103

W-104

W-105

Badges:

B-00125

B-00131

B-00142

B-00147

Calibration:

CAL-03

Measurements:

MEAS-1042

MEAS-1041

MEAS-1040

MEAS-1039

Use realistic-looking but clearly DEMO values.

Never claim these values are actual H₂S exposure measurements.

==================================================

BUTTON BEHAVIOR

==================================================

EVERY BUTTON MUST WORK.

Examples:

Capture Image

→ camera/upload interface

Upload Image

→ file picker

Demo Capture

→ load demo capture

Retake

→ return to capture

Validate Image

→ run validation animation

Continue

→ next workflow step

Run Color Analysis

→ processing animation → result

Run Estimation

→ model animation → demo estimate

Explain Result

→ traceability screen

Save Measurement

→ LocalStorage + success toast

View

→ detail drawer

Review

→ review modal

Approve

→ status changes

Reject

→ status changes

Request Recapture

→ status changes

Export CSV

→ download CSV

Generate Report

→ generate mock report state

Sync Now

→ synchronization animation

Notifications

→ notification panel

Search

→ filter tables

Filters

→ dynamically update mock data

==================================================

IMPORTANT UX FEATURE — LIVE WORKFLOW

==================================================

At the top of Capture / Measurement pages show a persistent workflow tracker:

01 CAPTURE

02 VALIDATE

03 NORMALIZE

04 ESTIMATE

05 RECORD

06 REVIEW

Current stage should be highlighted.

Completed stages should have checkmarks.

Users should be able to click completed stages to inspect previous results.

==================================================

IMPORTANT UX FEATURE — TRACEABILITY

==================================================

Every measurement must have a "Trace ID".

Example:

TRACE-MEAS-1042

Display this on the measurement detail page.

The user should be able to visually trace:

Worker

→ Shift

→ Badge

→ Image

→ Validation

→ Color Features

→ Calibration

→ Exposure Estimate

→ Review

This is a major product feature.

==================================================

IMPORTANT UX FEATURE — SAFETY STATES

==================================================

Use clearly differentiated states:

VALID

INVALID

REVIEW REQUIRED

EXPIRED

PROCESSING

OFFLINE

SYNCED

Use icons and text in addition to color.

Do not rely only on red/green color.

==================================================

RESPONSIVE DESIGN

==================================================

Desktop:

Control-room dashboard.

Tablet:

Two-column layout.

Mobile:

Worker capture experience should become the primary interface.

The mobile capture page should have:

Large capture frame

Large Capture button

Simple instructions

Large measurement result

Minimal distractions

HSE Dashboard should remain optimized for desktop.

==================================================

ANIMATIONS

==================================================

Use subtle Framer Motion animations.

Examples:

Page transitions

Card entrance

Workflow progress

Scanning animation

Validation checks

Processing pipeline

Chart appearance

Notification toast

Modal transitions

Avoid excessive animations.

==================================================

VISUAL WOW MOMENT

==================================================

Create a special "Measurement Trace" visualization.

When estimation completes:

The captured wristband image appears on the left.

An animated line connects:

Sensing Region

→

Reference Palette

→

Normalized Color

→

Calibration Model

→

Estimated Exposure

On the right:

"2.1 ppm·h"

"DEMO ESTIMATE"

"Trace ID: TRACE-MEAS-1042"

Then show:

✓ Image validated

✓ Badge validated

✓ Calibration verified

✓ Estimate generated

This should feel like scientific evidence rather than a generic AI result.

==================================================

NO BACKEND

==================================================

For this version:

Use mock services.

Create:

mockMeasurementService.ts

mockWorkerService.ts

mockBadgeService.ts

mockCalibrationService.ts

Use promises and artificial delays so the UI feels realistic.

Example:

validateImage()

runColorAnalysis()

runExposureEstimation()

saveMeasurement()

syncRecords()

These should return mock data.

Keep all service interfaces clean so a real FastAPI/Spring Boot backend can replace them later.

==================================================

CODE QUALITY

==================================================

Use reusable components:

Button

Card

StatusBadge

MetricCard

DataTable

Modal

Drawer

Toast

WorkflowStepper

MeasurementTrace

ExposureChart

ValidationChecklist

CameraCapture

ColorPalette

ProcessingPipeline

NotificationPanel

Use TypeScript interfaces.

Do not put everything into App.tsx.

Keep components modular.

==================================================

FINAL REQUIREMENT

==================================================

The final frontend should feel like a real industrial HSE product called:

H₂S GUARD

Passive Exposure Monitoring

The main user journey must be:

LOGIN

↓

WORKER IDENTIFICATION

↓

CAPTURE WRISTBAND

↓

IMAGE VALIDATION

↓

BADGE VALIDATION

↓

COLOR NORMALIZATION

↓

AI/CALIBRATION ESTIMATION

↓

EXPOSURE RESULT

↓

EXPLAIN MEASUREMENT

↓

SAVE RECORD

↓

HSE DASHBOARD

↓

ALERT / REVIEW

↓

REPORT

Build the frontend fully with working navigation, working buttons, working modals, working filters, mock camera/upload flow, LocalStorage persistence, charts, animations and demo data.

Do not leave placeholder buttons saying "Coming Soon".

The application should be immediately runnable with:

npm install

npm run dev

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://hsg-guard-trace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/744d8912-83ee-4520-8713-0c93e79d6cb2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
