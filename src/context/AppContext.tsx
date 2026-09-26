import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  workers as seedWorkers,
  badges as seedBadges,
  measurements as seedMeasurements,
  alerts as seedAlerts,
  notifications as seedNotifications,
  sampleWorkers,
  sampleBadges,
  sampleMeasurements,
  sampleAlerts,
  sampleNotifications,
} from "@/data/mockData";
import { mockMeasurementService } from "@/services/mockServices";
import type { BadgeRecord, Measurement, NotificationItem, ReviewAlert, UserAccount, Worker, ActiveViewMode } from "@/types/h2s";

import type { SupportedLanguage } from "@/lib/translations";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { saveUserToDB, getUsersFromDB } from "@/lib/db";
import { getNextIterativeBadgeId, getNextIterativeBatchId } from "@/lib/badgeUtils";


const DEFAULT_USERS: UserAccount[] = [];

export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserAccount;
}

interface AppState {
  online: boolean;
  pending: number;
  dark: boolean;
  demoMode: boolean;
  activeViewMode: ActiveViewMode;
  setActiveViewMode: (mode: ActiveViewMode) => void;

  // Language state
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;

  // User Accounts & Authentication
  registeredUsers: UserAccount[];
  currentUser: UserAccount | null;
  registerUser: (user: UserAccount) => AuthResult;
  loginUser: (emailOrId: string, pass: string) => AuthResult;
  logoutUser: () => void;

  // Dynamic Data Stores
  workers: Worker[];
  badges: BadgeRecord[];
  measurements: Measurement[];
  alerts: ReviewAlert[];
  notifications: NotificationItem[];

  // Data Actions
  setOnline: (v: boolean) => void;
  setDark: (v: boolean) => void;
  setDemoMode: (v: boolean) => void;
  saveMeasurement: (m: Measurement) => Promise<void>;
  sync: () => Promise<void>;
  review: (id: string, status: ReviewAlert["status"]) => void;
  markNotificationsRead: () => void;
  clearAllData: () => void;
  loadSampleData: () => void;
}

const Context = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [online, setOnlineState] = useState(true);
  const [pending, setPending] = useState(0);
  const [dark, setDarkState] = useState(false);
  const [demoMode, setDemoModeState] = useState(false);
  const [activeViewMode, setActiveViewModeState] = useState<ActiveViewMode>("dashboard");
  const [language, setLanguageState] = useState<SupportedLanguage>("English");

  // User Authentication state (Clean start, 0 demo users)
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Dynamic Data Arrays (Clean start, 0 demo records)
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [alerts, setAlerts] = useState<ReviewAlert[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    try {
      setOnlineState(localStorage.getItem("h2s.online") !== "false");
      setPending(Number(localStorage.getItem("h2s.pending") ?? 0));
      setDarkState(localStorage.getItem("h2s.dark") === "true");
      setDemoModeState(false);
      const savedLang = localStorage.getItem("h2s.language") as SupportedLanguage;
      if (savedLang) setLanguageState(savedLang);

      // Load registered users from IndexedDB database & localStorage
      getUsersFromDB().then((idbUsers) => {
        if (idbUsers.length > 0) {
          setRegisteredUsers((prev) => {
            const merged = [...idbUsers, ...prev.filter((p) => !idbUsers.some((i) => i.id === p.id))];
            localStorage.setItem("h2s.users", JSON.stringify(merged));
            return merged;
          });
        }
      });

      const savedUsersStr = localStorage.getItem("h2s.users");
      let loadedUsers: UserAccount[] = [];
      if (savedUsersStr) {
        try {
          loadedUsers = JSON.parse(savedUsersStr) as UserAccount[];
        } catch {
          loadedUsers = [];
        }
      }

      setRegisteredUsers(loadedUsers);

      // Sync matching workers & badges for registered worker users
      const savedWorkers = JSON.parse(localStorage.getItem("h2s.workers") || "[]") as Worker[];
      const userWorkers: Worker[] = loadedUsers
        .filter((u) => u.role === "worker")
        .map((u) => ({
          id: u.id,
          name: u.name,
          shift: u.shift,
          badgeId: u.badgeId,
          latestExposure: 0,
          lastMeasurement: "Registered worker",
          status: "Active" as const,
        }));

      const mergedWorkers = Array.from(
        new Map([...userWorkers, ...savedWorkers].map((w) => [w.id, w])).values()
      );
      setWorkers(mergedWorkers);

      const savedBadges = JSON.parse(localStorage.getItem("h2s.badges") || "[]") as BadgeRecord[];
      const userBadges: BadgeRecord[] = loadedUsers
        .filter((u) => u.role === "worker" && u.badgeId)
        .map((u) => ({
          id: u.badgeId,
          batch: u.batchId || "BATCH-07",
          workerId: u.id,
          manufactured: "20-Sep-2026",
          expiry: "20-Dec-2026",
          calibration: "CAL-03",
          status: "VALID" as const,
          measurements: 0,
        }));
      const mergedBadges = Array.from(
        new Map([...userBadges, ...savedBadges].map((b) => [b.id, b])).values()
      );
      setBadges(mergedBadges);

      // Load saved current user
      const savedCurrUserStr = localStorage.getItem("h2s.currentUser");
      if (savedCurrUserStr) {
        try {
          const savedCurrUser = JSON.parse(savedCurrUserStr) as UserAccount | null;
          if (savedCurrUser) {
            setCurrentUser(savedCurrUser);
          }
        } catch {
          setCurrentUser(null);
        }
      }

      // Load saved measurements
      const savedMeas = JSON.parse(localStorage.getItem("h2s.measurements") || "[]") as Measurement[];
      if (savedMeas.length) {
        setMeasurements(savedMeas);
      }
    } catch (e) {
      console.error("Error loading stored h2s data:", e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const setOnline = (v: boolean) => {
    setOnlineState(v);
    localStorage.setItem("h2s.online", String(v));
    toast(v ? "Online mode active" : "Offline mode active");
  };

  const setDark = (v: boolean) => {
    setDarkState(v);
    localStorage.setItem("h2s.dark", String(v));
  };

  const setDemoMode = (v: boolean) => {
    setDemoModeState(v);
    localStorage.setItem("h2s.demo", String(v));
  };

  const setActiveViewMode = (mode: ActiveViewMode) => {
    setActiveViewModeState(mode);
    toast(`Switched to ${mode === "mobile" ? "Mobile Worker App" : "Safety Monitor Dashboard"}`);
  };

  // Strict User Account Registration Validation
  const registerUser = (newUser: UserAccount): AuthResult => {
    const trimmedId = newUser.id.trim();
    const trimmedEmail = newUser.email.trim().toLowerCase();
    const trimmedName = newUser.name.trim();

    if (!trimmedName || trimmedName.length < 2) {
      const msg = "Full Name must be at least 2 characters long.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    if (!trimmedId || trimmedId.length < 2) {
      const msg = "Worker or Officer ID must be provided.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      const msg = "Please enter a valid email address (e.g. name@company.com).";
      toast.error(msg);
      return { success: false, message: msg };
    }

    if (!newUser.password || newUser.password.trim().length < 3) {
      const msg = "Password must be at least 3 characters long.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    // Duplicate Worker/Officer ID Check
    const duplicateId = registeredUsers.find(
      (u) => u.id.toLowerCase() === trimmedId.toLowerCase()
    );
    if (duplicateId) {
      const msg = `Worker/Officer ID "${trimmedId}" is already registered. Please log in instead.`;
      toast.error(msg);
      return { success: false, message: msg };
    }

    // Duplicate Email Check
    const duplicateEmail = registeredUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (duplicateEmail) {
      const msg = `Email address "${trimmedEmail}" is already registered. Please log in instead.`;
      toast.error(msg);
      return { success: false, message: msg };
    }

    // Generate guaranteed UNIQUE Iterative Badge ID & Batch ID
    let uniqueBadgeId = newUser.badgeId?.trim();
    if (!uniqueBadgeId || badges.some((b) => b.id === uniqueBadgeId) || registeredUsers.some((u) => u.badgeId === uniqueBadgeId)) {
      uniqueBadgeId = getNextIterativeBadgeId(badges, registeredUsers);
    }

    let uniqueBatchId = newUser.batchId?.trim();
    if (!uniqueBatchId || registeredUsers.some((u) => u.batchId === uniqueBatchId) || badges.some((b) => b.batch === uniqueBatchId)) {
      uniqueBatchId = getNextIterativeBatchId(badges, registeredUsers);
    }

    const finalUser: UserAccount = {
      ...newUser,
      id: trimmedId,
      name: trimmedName,
      email: trimmedEmail,
      password: newUser.password.trim(),
      badgeId: uniqueBadgeId,
      batchId: uniqueBatchId,
    };

    const updatedUsers = [finalUser, ...registeredUsers];
    setRegisteredUsers(updatedUsers);
    setCurrentUser(finalUser);
    localStorage.setItem("h2s.users", JSON.stringify(updatedUsers));
    localStorage.setItem("h2s.currentUser", JSON.stringify(finalUser));

    // Save to IndexedDB database
    saveUserToDB(finalUser);


    if (isSupabaseConfigured && supabase) {
      supabase
        .from("users")
        .upsert([
          {
            id: finalUser.id,
            name: finalUser.name,
            email: finalUser.email,
            password: finalUser.password,
            role: finalUser.role,
            shift: finalUser.shift,
            badge_id: finalUser.badgeId,
            batch_id: finalUser.batchId,
            created_at: finalUser.createdAt || new Date().toISOString(),
          },
        ])
        .then(({ error }) => {
          if (error) {
            console.error("Failed to sync registered user to Supabase PostgreSQL:", error);
          }
        });
    }


    // Automatically register matching worker & badge records
    if (finalUser.role === "worker") {
      const newWorker: Worker = {
        id: finalUser.id,
        name: finalUser.name,
        shift: finalUser.shift,
        badgeId: finalUser.badgeId,
        latestExposure: 0,
        lastMeasurement: "Just registered",
        status: "Active",
      };
      setWorkers((prev) => {
        const next = [newWorker, ...prev.filter((w) => w.id !== newWorker.id)];
        localStorage.setItem("h2s.workers", JSON.stringify(next));
        return next;
      });

      const newBadge: BadgeRecord = {
        id: finalUser.badgeId,
        batch: finalUser.batchId,
        workerId: finalUser.id,
        manufactured: "20-Sep-2026",
        expiry: "20-Dec-2026",
        calibration: "CAL-03",
        status: "VALID",
        measurements: 0,
      };
      setBadges((prev) => {
        const next = [newBadge, ...prev.filter((b) => b.id !== newBadge.id)];
        localStorage.setItem("h2s.badges", JSON.stringify(next));
        return next;
      });
    }

    const successMsg = `Account registered successfully! Logged in as ${finalUser.name}`;
    toast.success(successMsg);
    return { success: true, message: successMsg, user: finalUser };
  };

  // Strict User Login Validation
  const loginUser = (emailOrId: string, pass: string): AuthResult => {
    const trimmedInput = emailOrId.trim().toLowerCase();
    if (!trimmedInput) {
      const msg = "Please enter your Worker/Officer ID or Email address.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    const found = registeredUsers.find(
      (u) => u.id.toLowerCase() === trimmedInput || u.email.toLowerCase() === trimmedInput
    );

    if (!found) {
      const msg = `Account not found for "${emailOrId}". Please register a new account first.`;
      toast.error(msg);
      return { success: false, message: msg };
    }

    // Verify password if account has password set
    if (found.password && pass.trim() !== found.password) {
      const msg = "Incorrect password or PIN. Please enter correct credentials.";
      toast.error(msg);
      return { success: false, message: msg };
    }

    setCurrentUser(found);
    localStorage.setItem("h2s.currentUser", JSON.stringify(found));
    const msg = `Logged in as ${found.name} (${found.id})`;
    toast.success(msg);
    return { success: true, message: msg, user: found };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("h2s.currentUser");
    toast("Logged out of account");
    if (typeof window !== "undefined") {
      window.location.href = window.location.origin + "/";
    }
  };

  // Save new measurement dynamically & update alerts/roster
  const saveMeasurement = async (m: Measurement) => {
    await mockMeasurementService.saveMeasurement(m);

    setMeasurements((prev) => {
      const next = [m, ...prev];
      localStorage.setItem("h2s.measurements", JSON.stringify(next));
      return next;
    });

    const isHighExposure = (m.exposure ?? 0) > 20.0 || (m.twaPpm ?? 0) > 2.5;
    const isModerateExposure = (m.exposure ?? 0) >= 8.0 || (m.twaPpm ?? 0) >= 1.0;

    // Update worker's latest exposure & status
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === m.workerId
          ? {
            ...w,
            latestExposure: m.exposure ?? w.latestExposure,
            lastMeasurement: m.time,
            status: isHighExposure ? "Review" : "Active",
          }
          : w
      )
    );

    // Auto-generate alert in Alerts & Review queue if High Exposure or Invalid Quality
    if (isHighExposure || isModerateExposure || m.status === "INVALID" || m.status === "REVIEW REQUIRED") {
      const alertCategory = isHighExposure ? "HSE REVIEW" : m.status === "INVALID" ? "IMAGE" : "MEASUREMENT";
      const alertTitle = isHighExposure
        ? `🚨 HIGH H₂S EXPOSURE HAZARD (${(m.exposure ?? 0).toFixed(1)} ppm·h)`
        : isModerateExposure
          ? `⚠ MODERATE H₂S EXPOSURE (${(m.exposure ?? 0).toFixed(1)} ppm·h)`
          : "Measurement Review Required";

      const newAlert: ReviewAlert = {
        id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
        category: alertCategory,
        title: alertTitle,
        subject: `Worker ${m.workerId} (Badge ${m.badgeId})`,
        reason: isHighExposure
          ? `Shift average ${m.twaPpm ? m.twaPpm.toFixed(2) : ((m.exposure || 0) / 8).toFixed(2)} ppm TWA exceeds 2.5 ppm limit. Immediate action required.`
          : isModerateExposure
            ? `Moderate exposure warning threshold (${m.twaPpm ? m.twaPpm.toFixed(2) : ((m.exposure || 0) / 8).toFixed(2)} ppm TWA). Ensure area ventilation.`
            : "Image pixel check exception",
        status: "Open",
      };

      setAlerts((prev) => [newAlert, ...prev]);
      setNotifications((prev) => [
        {
          id: `N-${Date.now()}`,
          title: newAlert.title,
          detail: `${m.id} · ${m.workerId}`,
          to: "/alerts",
          read: false,
        },
        ...prev,
      ]);
    }

    if (!online) {
      setPending((x) => {
        const n = x + 1;
        localStorage.setItem("h2s.pending", String(n));
        return n;
      });
    }

    toast.success("Measurement recorded dynamically");
  };

  const sync = async () => {
    if (!online) {
      toast.error("Reconnect before synchronizing");
      return;
    }
    await mockMeasurementService.syncRecords();
    setPending(0);
    localStorage.setItem("h2s.pending", "0");
    toast.success("All records synchronized");
  };

  const review = (id: string, status: ReviewAlert["status"]) => {
    setAlerts((x) => x.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Review status updated: ${status}`);
  };

  const markNotificationsRead = () => {
    setNotifications((x) => x.map((n) => ({ ...n, read: true })));
  };

  const clearAllData = () => {
    setMeasurements([]);
    setWorkers([]);
    setBadges([]);
    setAlerts([]);
    setNotifications([]);
    setPending(0);
    localStorage.removeItem("h2s.measurements");
    localStorage.removeItem("h2s.pending");
    toast.success("All records cleared. System reset to 0 data.");
  };

  const loadSampleData = () => {
    setWorkers(sampleWorkers);
    setBadges(sampleBadges);
    setMeasurements(sampleMeasurements);
    setAlerts(sampleAlerts);
    setNotifications(sampleNotifications);
    toast.success("Loaded demo sample dataset");
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("h2s.language", lang);
    toast.success(`Language set to ${lang}`);
  };

  const value = useMemo(
    () => ({
      online,
      pending,
      dark,
      demoMode,
      activeViewMode,
      setActiveViewMode,
      language,
      setLanguage,
      registeredUsers,
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      workers,
      badges,
      measurements,
      alerts,
      notifications,
      setOnline,
      setDark,
      setDemoMode,
      saveMeasurement,
      sync,
      review,
      markNotificationsRead,
      clearAllData,
      loadSampleData,
    }),
    [
      online,
      pending,
      dark,
      demoMode,
      activeViewMode,
      language,
      registeredUsers,
      currentUser,
      workers,
      badges,
      measurements,
      alerts,
      notifications,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp() {
  const v = useContext(Context);
  if (!v) throw new Error("AppProvider missing");
  return v;
}
