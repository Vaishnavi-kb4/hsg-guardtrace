import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  LayoutDashboard,
  Activity,
  Bell,
  Boxes,
  Camera,
  ChevronDown,
  ClipboardList,
  Cloud,
  CloudOff,
  Clock,
  Gauge,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
  Wifi,
  UserPlus,
  LogOut,
  Smartphone,
  Monitor,
  QrCode,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { AuthDialog } from "@/components/h2s/AuthDialog";
import { RegisterWorkerWizard } from "@/components/h2s/RegisterWorkerWizard";
import { translations, type SupportedLanguage } from "@/lib/translations";
import { LocalQrCode } from "@/components/h2s/LocalQrCode";

const navConfig = [
  { to: "/", key: "overview" as const, icon: Gauge },
  { to: "/measurements", key: "measurements" as const, icon: Activity },
  { to: "/workers", key: "workers" as const, icon: Users },
  { to: "/badges", key: "badges" as const, icon: Boxes },
  { to: "/shifts", key: "shifts" as const, icon: Clock },
  { to: "/alerts", key: "alerts" as const, icon: ShieldAlert },
  { to: "/reports", key: "reports" as const, icon: ClipboardList },
  { to: "/assistant", key: "assistant" as const, icon: Sparkles },
  { to: "/settings", key: "settings" as const, icon: Settings },
] as const;

function Brand() {
  const { language } = useApp();
  const t = translations[language] || translations.English;

  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="relative grid size-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <span className="font-mono text-sm font-black">H₂S</span>
        <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-sidebar bg-success" />
      </div>
      <div>
        <div className="font-display text-lg font-black text-sidebar-foreground">H₂S GUARD</div>
        <div className="text-[9px] font-semibold uppercase text-sidebar-muted font-mono">{t.officerPortal}</div>
      </div>
    </Link>
  );
}

function SideNav({ onSelect }: { onSelect?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { alerts, language } = useApp();
  const t = translations[language] || translations.English;
  const openAlertsCount = alerts.filter((a) => a.status === "Open").length;

  return (
    <div className="flex h-full flex-col bg-sidebar px-3 py-5">
      <div className="px-2">
        <Brand />
      </div>
      <nav className="mt-8 space-y-1">
        {navConfig.map(({ to, key, icon: Icon }) => {
          const label = t[key];
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onSelect}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
              {key === "alerts" && openAlertsCount > 0 && (
                <span className="ml-auto rounded-full bg-warning px-1.5 py-0.5 text-[9px] font-black text-warning-foreground">
                  {openAlertsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-surface p-3">
          <div className="mb-2 text-[10px] font-bold uppercase text-sidebar-muted">HSE System Status</div>
          <div className="flex items-center gap-2 text-xs text-sidebar-foreground">
            <span className="size-2 rounded-full bg-success" />
            Central HSE Database Active
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { online, setOnline, pending, notifications, markNotificationsRead, currentUser, logoutUser, language, setLanguage } = useApp();
  const [mobile, setMobile] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showPhoneQr, setShowPhoneQr] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const t = translations[language] || translations.English;

  const isHseOfficer = currentUser && currentUser.role === "monitor";

  // Language bar component
  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <Globe className="size-3.5 text-blue-600 ml-1.5 mr-1 shrink-0" />
      {(["English", "தமிழ்", "हिंदी", "ಕನ್ನಡ", "മലയാളം"] as SupportedLanguage[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`px-2.5 py-1 rounded-lg transition-all ${language === lang
              ? "bg-blue-900 text-white shadow-xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );

  // If NOT HSE officer (i.e. Auth Gateway view or Field Worker view), render clean full screen without HSE sidebar
  if (!isHseOfficer) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sticky top-0 z-30">
          <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between px-3 sm:px-6 py-2 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="relative grid size-8 sm:size-9 place-items-center rounded-lg bg-blue-900 text-white font-mono text-xs font-black shrink-0">
                H₂S
              </div>
              <div>
                <span className="font-display text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-slate-100">H₂S GUARD</span>
                <span className="block text-[9px] sm:text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400">
                  {currentUser ? t.workerInterface : "Authentication Portal"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <LanguageSwitcher />

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="hidden text-right text-xs sm:block">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">ID: {currentUser.id} · {currentUser.shift}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logoutUser} className="gap-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30">
                    <LogOut className="size-3.5" /> Log Out
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setAuthOpen(true)} className="gap-1.5 text-xs font-bold bg-blue-900 text-white hover:bg-blue-800 border-none">
                  <UserPlus className="size-3.5" /> Register / Log In
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  // HSE OFFICER FULL DESKTOP DASHBOARD LAYOUT WITH SIDEBAR
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SideNav />
      </aside>

      <header className="fixed inset-x-0 top-0 z-20 h-16 border-b border-border bg-background/95 backdrop-blur lg:left-64">
        <div className="flex h-full items-center gap-3 px-4 lg:px-7">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open navigation">
            <Menu />
          </Button>

          {/* Quick Back & Dashboard Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="h-8 text-xs font-bold gap-1"
              title="Go Back to Previous Page"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs font-bold gap-1"
              title="Return to HSE Dashboard Overview"
            >
              <Link to="/">
                <LayoutDashboard className="size-3.5 text-primary" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            </Button>
          </div>

          <div className="hidden h-6 w-px bg-border sm:block" />

          <LanguageSwitcher />

          <div className="hidden h-6 w-px bg-border md:block" />

          {/* Account Login / Registration Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAuthOpen(true)}
            className="gap-2 font-bold text-xs bg-emerald-800 text-white hover:bg-emerald-700 border-none"
          >
            <ShieldAlert className="size-3.5" />
            <span className="hidden sm:inline">HSE Officer: {currentUser.name}</span>
          </Button>

          <div className="relative ml-auto hidden max-w-xs flex-1 xl:block">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search measurement, worker or badge" className="h-9 bg-muted pl-9 text-xs" />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOnline(!online)}
            className={cn("gap-2", !online && "border-warning bg-warning-soft text-warning-foreground")}
          >
            {online ? <Cloud className="size-4" /> : <CloudOff className="size-4" />}
            <span className="hidden sm:inline">{online ? "ONLINE" : "OFFLINE"}</span>
          </Button>

          <Popover onOpenChange={(o) => o && markNotificationsRead()}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell />
                {unread > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[360px] p-0">
              <div className="border-b border-border p-4">
                <div className="font-bold">Notification Center</div>
                <p className="text-xs text-muted-foreground">Operational updates & high exposure alerts</p>
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-xs text-center text-muted-foreground">No notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <Link key={n.id} to={n.to} className="flex gap-3 border-b border-border p-4 hover:bg-muted">
                      <span className={cn("mt-1 size-2 rounded-full", n.read ? "bg-border" : "bg-primary")} />
                      <div>
                        <div className="text-sm font-semibold">{n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.detail}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" onClick={logoutUser} title="Log Out HSE Officer">
            <LogOut className="size-4 text-destructive" />
          </Button>
        </div>

        {!online && (
          <div className="flex h-8 items-center justify-center bg-warning-soft text-xs font-semibold text-warning-foreground">
            Offline mode active · {pending} records pending synchronization
          </div>
        )}
      </header>

      <main className={cn("min-h-screen px-4 pb-24 pt-24 lg:ml-64 lg:px-7 lg:pb-8", !online && "pt-32")}>
        {children}
      </main>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-72 border-none p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>H₂S GUARD sections</SheetDescription>
          </SheetHeader>
          <SideNav onSelect={() => setMobile(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
