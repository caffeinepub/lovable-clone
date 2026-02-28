import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppLayout } from "../components/AppLayout";
import {
  useUserProfile,
  useSaveUserProfile,
  useUserSettings,
  useSaveUserSettings,
} from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Palette,
  Bell,
  CreditCard,
  Loader2,
  Check,
  LogOut,
  Copy,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

// ── Profile Tab ───────────────────────────────────────────
function ProfileTab() {
  const { data: profile, isLoading } = useUserProfile();
  const saveProfile = useSaveUserProfile();
  const { identity } = useInternetIdentity();
  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const principalStr = identity?.getPrincipal().toString() ?? "—";

  useEffect(() => {
    if (profile) setDisplayName(profile.displayName || "");
  }, [profile]);

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({ displayName: displayName.trim(), avatarUrl: profile?.avatarUrl ?? "" });
      setSaved(true);
      toast.success("Profile saved");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(principalStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-base font-bold font-display text-foreground mb-1">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information.</p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-20" />
        </div>
      ) : (
        <div className="space-y-5 max-w-sm">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
            >
              {(displayName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{displayName || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">Click to change avatar</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="h-9 max-w-sm"
              onKeyDown={(e) => { if (e.key === "Enter") void handleSave(); }}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Principal ID</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg text-xs font-mono text-muted-foreground bg-secondary/60 border border-border truncate">
                {principalStr}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 shrink-0 h-8"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!displayName.trim() || saveProfile.isPending}
            className="btn-pink px-5 py-2 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveProfile.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <Check className="w-3.5 h-3.5" />
            ) : null}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── Appearance Tab ─────────────────────────────────────────
function AppearanceTab() {
  const { data: settings, isLoading } = useUserSettings();
  const saveSettings = useSaveUserSettings();
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setTheme(settings.theme || "light");
  }, [settings]);

  const handleSave = async () => {
    try {
      await saveSettings.mutateAsync({
        theme,
        notificationsEnabled: settings?.notificationsEnabled ?? true,
        plan: settings?.plan ?? "free",
      });
      setSaved(true);
      toast.success("Appearance saved");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save");
    }
  };

  const themes = [
    { id: "light", label: "Light", icon: Sun, desc: "Clean and bright" },
    { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
    { id: "system", label: "System", icon: Monitor, desc: "Follows OS setting" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-base font-bold font-display text-foreground mb-1">Appearance</h2>
        <p className="text-sm text-muted-foreground">Customize how Lovable looks for you.</p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 max-w-lg">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <Label className="text-sm font-medium mb-3 block">Theme</Label>
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              {themes.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className="relative p-4 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: theme === id ? "oklch(0.62 0.22 25)" : "oklch(var(--border))",
                    background: theme === id ? "oklch(0.62 0.22 25 / 0.06)" : "oklch(var(--card))",
                  }}
                >
                  {theme === id && (
                    <div
                      className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <Icon className="w-5 h-5 mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saveSettings.isPending}
            className="btn-pink px-5 py-2 text-sm flex items-center gap-2"
          >
            {saveSettings.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <Check className="w-3.5 h-3.5" />
            ) : null}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── Notifications Tab ─────────────────────────────────────
function NotificationsTab() {
  const { data: settings, isLoading } = useUserSettings();
  const saveSettings = useSaveUserSettings();
  const [notifs, setNotifs] = useState(true);
  const [buildNotifs, setBuildNotifs] = useState(true);
  const [deployNotifs, setDeployNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setNotifs(settings.notificationsEnabled);
  }, [settings]);

  const handleSave = async () => {
    try {
      await saveSettings.mutateAsync({
        theme: settings?.theme ?? "light",
        notificationsEnabled: notifs,
        plan: settings?.plan ?? "free",
      });
      setSaved(true);
      toast.success("Notification preferences saved");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save");
    }
  };

  const toggleItems = [
    { id: "main", label: "Enable Notifications", desc: "Receive in-app notifications", value: notifs, onChange: setNotifs },
    { id: "build", label: "Build Notifications", desc: "Get notified when builds complete", value: buildNotifs, onChange: setBuildNotifs },
    { id: "deploy", label: "Deploy Alerts", desc: "Notify when a site goes live", value: deployNotifs, onChange: setDeployNotifs },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-base font-bold font-display text-foreground mb-1">Notifications</h2>
        <p className="text-sm text-muted-foreground">Control how and when you get notified.</p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-1 max-w-lg">
            {toggleItems.map(({ id, label, desc, value, onChange }) => (
              <div key={id} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
                <Switch checked={value} onCheckedChange={onChange} aria-label={label} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saveSettings.isPending}
            className="btn-pink px-5 py-2 text-sm flex items-center gap-2"
          >
            {saveSettings.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : null}
            {saved ? "Saved!" : "Save Preferences"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── Billing Tab ───────────────────────────────────────────
function BillingTab() {
  const { data: settings } = useUserSettings();
  const plan = settings?.plan ?? "free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-base font-bold font-display text-foreground mb-1">Billing</h2>
        <p className="text-sm text-muted-foreground">Manage your subscription and billing details.</p>
      </div>

      <Separator />

      {/* Current plan */}
      <div className="max-w-lg">
        <div className="lovable-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Current plan</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-display text-foreground capitalize">{plan}</span>
                {plan === "pro" && (
                  <Badge className="bg-gradient-to-r from-rose-500 to-orange-400 text-white border-0 text-[10px]">
                    <Crown className="w-2.5 h-2.5 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.94 0.04 340))" }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {plan === "free" ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-medium text-foreground">5 / 5</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-full bg-primary rounded-full" />
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Unlimited projects · All features included</div>
            )}
          </div>

          {plan === "free" && (
            <button type="button" className="btn-pink w-full py-2.5 text-sm flex items-center justify-center gap-2">
              <Crown className="w-4 h-4" />
              Upgrade to Pro – $20/month
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Settings Page ─────────────────────────────────────────
export function SettingsPage() {
  const { clear } = useInternetIdentity();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <AppLayout title="Settings" breadcrumbs={[{ label: "Settings" }]}>
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-black font-display text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account, appearance, and preferences.
          </p>
        </motion.div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-8 bg-secondary/40 border border-border p-1 rounded-xl h-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile"><ProfileTab /></TabsContent>
          <TabsContent value="appearance"><AppearanceTab /></TabsContent>
          <TabsContent value="notifications"><NotificationsTab /></TabsContent>
          <TabsContent value="billing"><BillingTab /></TabsContent>
        </Tabs>

        {/* Sign out */}
        <div className="mt-12 pt-8 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={clear}
            className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <footer className="border-t border-border/50 py-4 px-6 mt-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          <a
            href="/cookies"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cookies Policy
          </a>
        </div>
      </footer>
    </AppLayout>
  );
}
