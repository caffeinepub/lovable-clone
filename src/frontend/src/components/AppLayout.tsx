import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ChevronDown,
  LayoutTemplate,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/dashboard", label: "Projects", icon: LayoutDashboard },
  { path: "/projects", label: "All Projects", icon: FolderOpen },
  { path: "/templates", label: "Templates", icon: LayoutTemplate },
  { path: "/settings", label: "Settings", icon: Settings },
];

function SidebarNavItem({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  const inner = (
    <Link
      to={item.path}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        isActive
          ? "nav-item-active"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      {/* Active pill */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl"
          style={{ background: "oklch(0.62 0.22 25 / 0.08)" }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}

      <span className="relative z-10 shrink-0">
        <Icon
          className={cn(
            "w-4 h-4 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        />
      </span>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{inner}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return inner;
}

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function AppLayout({ children, title, breadcrumbs, actions }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const displayName = profile?.displayName || principalStr.slice(0, 8) + "...";
  const initials = (profile?.displayName ?? "U").slice(0, 2).toUpperCase();

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 228 }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="relative flex flex-col h-full border-r border-sidebar-border overflow-hidden"
        style={{ background: "oklch(var(--sidebar))", flexShrink: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-[57px] border-b border-sidebar-border shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="font-bold font-display text-foreground whitespace-nowrap overflow-hidden text-[15px]"
              >
                Lovable
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* New Project button */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          {collapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/dashboard"
                    className="w-10 h-10 flex items-center justify-center rounded-xl mx-auto transition-colors"
                    style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">New Project</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <AnimatePresence initial={false}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-white text-sm font-semibold transition-all"
                  style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
                >
                  <Plus className="w-4 h-4" />
                  New project
                </Link>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto custom-scroll px-3 py-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              isActive={
                currentPath === item.path ||
                (item.path !== "/" && currentPath.startsWith(item.path))
              }
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2.5 w-full rounded-xl px-2 py-2 transition-colors hover:bg-secondary",
                  collapsed && "justify-center"
                )}
              >
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback
                    className="text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex-1 min-w-0 flex items-center justify-between overflow-hidden"
                    >
                      <span className="text-xs font-medium text-foreground truncate">
                        {displayName}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48 mb-1">
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile & Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={clear}
                className="text-destructive focus:text-destructive gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-[52px] w-6 h-6 rounded-full border border-border bg-white shadow-sm flex items-center justify-center z-10 transition-colors hover:bg-secondary"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </motion.aside>

      {/* ── MAIN AREA ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-[57px] shrink-0 border-b border-border flex items-center px-6 gap-4 bg-white"
        >
          <div className="flex items-center gap-2 text-sm min-w-0 flex-1">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              breadcrumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-2 min-w-0">
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors truncate"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-foreground truncate font-display">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))
            ) : (
              <span className="font-semibold text-foreground font-display">{title}</span>
            )}
          </div>

          {/* Right actions */}
          {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </header>

        {/* Page content */}
        <motion.main
          key={currentPath}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 overflow-y-auto custom-scroll bg-background"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
