import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  Navigate,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ChatPage } from "./pages/ChatPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { EditorPage } from "./pages/EditorPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { CookiesPolicyPage } from "./pages/CookiesPolicyPage";
import { Loader2 } from "lucide-react";

// ── Auth guard ──────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

// ── Landing route ───────────────────────────────────────────
function LandingRouteComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }
  if (identity) return <Navigate to="/dashboard" />;
  return <LandingPage />;
}

// ── Root route ──────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// ── Routes ──────────────────────────────────────────────────
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingRouteComponent,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: () => (
    <AuthGuard>
      <ChatPage />
    </AuthGuard>
  ),
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: () => (
    <AuthGuard>
      <ProjectsPage />
    </AuthGuard>
  ),
});

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/templates",
  component: () => (
    <AuthGuard>
      <TemplatesPage />
    </AuthGuard>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <AuthGuard>
      <SettingsPage />
    </AuthGuard>
  ),
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor/$projectId",
  component: () => (
    <AuthGuard>
      <EditorPage />
    </AuthGuard>
  ),
});

const cookiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cookies",
  component: CookiesPolicyPage,
});

// ── Route tree ───────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  chatRoute,
  projectsRoute,
  templatesRoute,
  settingsRoute,
  editorRoute,
  cookiesRoute,
]);

// ── Router ───────────────────────────────────────────────────
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
