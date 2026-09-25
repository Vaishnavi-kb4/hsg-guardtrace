# H₂S GUARD Frontend

## Goal
Build a polished, frontend-only industrial HSE application for passive H₂S dosimeter capture, simulated analysis, traceability, review, and reporting. All displayed measurements remain clearly labeled as demo data.

## What will be built
- A responsive industrial control-room shell with desktop sidebar, mobile navigation, top plant/shift controls, search, notifications, profile, and online/offline state.
- Separate pages for Overview, Capture, Measurements, Workers, Badges, Calibration, Alerts & Review, Reports, HSE Assistant, Settings, plus a login/worker-identification entry experience.
- A complete clickable capture journey: worker selection, camera/upload/demo image, validation, badge validation, color normalization, demo estimation, explainable trace, save, and review.
- Reusable measurement drawer, review dialogs, notification panel, workflow stepper, scientific charts, status badges, tables, filters, toasts, and export controls.
- Centralized realistic mock records for workers, badges, measurements, alerts, calibration, and notifications.
- Local persistence for saved measurements, review decisions, settings, offline pending records, synchronization, and report state.
- Deterministic HSE Assistant responses grounded only in the mock records and approved example guidance.

## Interaction and safety behavior
- Camera access will use the browser camera when available, with a clear upload fallback.
- Demo capture and estimation will display “DEMO MODE” and “DEMO ESTIMATE”; no value will be presented as scientifically validated.
- Invalid image and expired badge simulations will branch into working recovery actions.
- Every requested action will change state, navigate, open a detail view, or download a generated file; there will be no dead controls.
- Safety states will always combine icon, label, and color.

## Visual direction
- Off-white scientific workspace with deep navy/charcoal structure, cool blue and teal signals, and restrained amber/red/green safety states.
- Thin steel-gray borders, compact technical labels, strong typography, large measurement readouts, clean charts, and subtle motion.
- Mobile prioritizes the capture frame and primary action; desktop prioritizes dense operational review.

## Technical approach
- Keep the existing TanStack Start/Vite/React foundation and use TanStack Router rather than replacing the project router.
- Add route files for each main section with unique page metadata.
- Use the existing Tailwind v4 design tokens and UI controls; add Recharts, Lucide icons, and Motion for React for focused animations.
- Organize shared types, mock data, mock services, app state, layout, domain components, and route pages into small modules.
- Mock services will expose promise-based interfaces with artificial delays for validation, color analysis, estimation, saving, and synchronization.
- Generate CSV and printable report downloads entirely in the browser.

## Validation
- Confirm the current preview builds without errors.
- Exercise the full demo capture-to-save journey and major navigation/actions in the browser.
- Verify desktop and mobile layouts, modal/drawer behavior, filtering, local persistence, offline synchronization, and downloads.
