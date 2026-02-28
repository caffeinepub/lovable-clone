import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useUserProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProjectStatus,
  useUserProfile,
} from "../hooks/useQueries";
import type { Project } from "../backend.d";
import { ProjectStatus } from "../backend.d";
import { AppLayout } from "../components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Globe,
  Loader2,
  Sparkles,
  MessageSquare,
  Edit3,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Format relative time ──────────────────────────────────
function formatRelativeTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}

// ── Project card ──────────────────────────────────────────
function ProjectCard({
  project,
  onOpen,
  onDelete,
  onPublish,
  index,
}: {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
  onPublish: () => void;
  index: number;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const isLive = project.status === ProjectStatus.live;
  const isBuilding = project.status === ProjectStatus.building;

  const colorSeed = project.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hues = [25, 285, 160, 200, 50, 340, 265];
  const hue = hues[colorSeed % hues.length];

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
        whileHover={{ y: -2 }}
        className="lovable-card overflow-hidden group cursor-pointer"
        onClick={onOpen}
      >
        {/* Preview area */}
        <div
          className="h-36 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, oklch(0.94 0.06 ${hue} / 0.6) 0%, oklch(0.96 0.04 ${(hue + 40) % 360} / 0.4) 100%)`,
          }}
        >
          {/* Mock wireframe */}
          <div className="absolute inset-0 p-3 flex flex-col gap-2 opacity-70">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-white/60 rounded w-1/4" />
              <div className="h-5 bg-white/30 rounded w-1/5 ml-auto" />
            </div>
            <div className="h-14 bg-white/40 rounded-lg w-full" />
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-6 bg-white/35 rounded" />
              <div className="h-6 bg-white/25 rounded" />
              <div className="h-6 bg-white/30 rounded" />
            </div>
          </div>

          {/* Status badge */}
          <div className="absolute top-2.5 left-2.5">
            {isLive && (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-emerald-600 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
            {isBuilding && (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-orange-500 shadow-sm">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Building
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
            <span className="bg-white/95 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <Edit3 className="w-3 h-3" />
              Open
            </span>
          </div>

          {/* Context menu button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                aria-label="Project options"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onOpen} className="gap-2">
                <Edit3 className="w-4 h-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onPublish(); }}
                className="gap-2"
              >
                <Globe className="w-4 h-4" />
                {isLive ? "Unpublish" : "Publish"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(true); }}
                className="text-destructive focus:text-destructive gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card body */}
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground font-display truncate mb-1 group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-xs text-muted-foreground truncate mb-2">{project.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(project.updatedAt)}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] px-1.5 h-4 font-medium",
                isLive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : isBuilding
                  ? "bg-orange-50 text-orange-500 border-orange-200"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {project.status}
            </Badge>
          </div>
        </div>
      </motion.article>

      <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{project.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── New project dialog ────────────────────────────────────
function NewProjectDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const updateStatus = useUpdateProjectStatus();

  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setPrompt("");
      setName("");
      setIsBuilding(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  const handleCreate = async () => {
    const projectName =
      name.trim() || (prompt.slice(0, 40) + (prompt.length > 40 ? "..." : "")) || "My Project";
    if (!prompt.trim()) return;

    setIsBuilding(true);
    try {
      const id = await createProject.mutateAsync({
        name: projectName,
        description: prompt.slice(0, 200),
        prompt: prompt.trim(),
      });

      await updateStatus.mutateAsync({ id, status: ProjectStatus.building });
      onClose();
      navigate({ to: "/editor/$projectId", params: { projectId: id } });
      toast.success("Project created!");
    } catch {
      setIsBuilding(false);
      toast.error("Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isBuilding && !o) onClose(); }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">What do you want to build?</DialogTitle>
          <DialogDescription>
            Describe your idea and we&apos;ll set up your project.
          </DialogDescription>
        </DialogHeader>

        {isBuilding ? (
          <div className="py-10 flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
              >
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div
                className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
              />
            </div>
            <div className="text-center">
              <p className="font-semibold font-display text-foreground">Building your app...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Setting up your project and workspace
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="prompt-container p-3">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to build... e.g. 'Build me a SaaS landing page with a hero section, pricing table, and contact form'"
                className="border-0 bg-transparent resize-none text-sm focus-visible:ring-0 min-h-[100px] p-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    void handleCreate();
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="project-name" className="text-xs font-medium text-muted-foreground block mb-1.5">
                Project name (optional)
              </label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome App"
                className="h-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleCreate();
                }}
              />
            </div>
          </div>
        )}

        {!isBuilding && (
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={!prompt.trim() || createProject.isPending}
              className="btn-pink px-5 py-2 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProject.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Create project
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Dashboard Page ────────────────────────────────────────
export function DashboardPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useUserProjects();
  const { data: profile } = useUserProfile();
  const deleteProject = useDeleteProject();
  const updateStatus = useUpdateProjectStatus();

  const [isCreating, setIsCreating] = useState(false);

  const displayName = profile?.displayName?.split(" ")[0] || "there";
  const recentProjects = (projects ?? [])
    .slice()
    .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handlePublishToggle = async (project: Project) => {
    try {
      const newStatus =
        project.status === ProjectStatus.live ? ProjectStatus.draft : ProjectStatus.live;
      await updateStatus.mutateAsync({ id: project.id, status: newStatus });
      toast.success(newStatus === ProjectStatus.live ? "Project published!" : "Project unpublished");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <AppLayout
      title="Projects"
      breadcrumbs={[{ label: "Projects" }]}
      actions={
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="btn-pink px-4 py-2 text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New project
        </button>
      }
    >
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-black font-display text-foreground">
            Good morning, {displayName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {recentProjects.length === 0
              ? "Ready to build something amazing?"
              : `You have ${recentProjects.length} project${recentProjects.length !== 1 ? "s" : ""}. What are you building today?`}
          </p>
        </motion.div>

        {/* Projects grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="lovable-card overflow-hidden">
                <Skeleton className="h-36 rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {recentProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={() =>
                    navigate({ to: "/editor/$projectId", params: { projectId: project.id } })
                  }
                  onDelete={() => void handleDeleteProject(project.id)}
                  onPublish={() => void handlePublishToggle(project)}
                />
              ))}
            </AnimatePresence>

            {/* New project tile */}
            <motion.button
              type="button"
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: recentProjects.length * 0.06 }}
              onClick={() => setIsCreating(true)}
              className="lovable-card border-dashed border-border/60 min-h-[200px] flex flex-col items-center justify-center gap-3 hover:border-primary/30 hover:bg-muted/30 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-muted/60 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                New project
              </span>
            </motion.button>
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.94 0.04 340))" }}
            >
              <Sparkles className="w-9 h-9 text-primary" />
            </div>
            <h2 className="text-xl font-bold font-display text-foreground mb-2">
              Build your first app
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
              Describe what you want to build in plain English and watch AI bring it to life in seconds.
            </p>

            {/* Prompt suggestions */}
            <div className="flex flex-col items-center gap-3 mb-8 w-full max-w-md">
              {[
                "Build me a SaaS landing page with pricing",
                "Create a personal portfolio with dark mode",
                "Make a dashboard with charts and analytics",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border bg-white hover:border-primary/30 hover:bg-muted/20 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {suggestion}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="btn-pink px-6 py-3 text-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Start building
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 px-6 mt-4">
        <div className="max-w-6xl mx-auto">
        </div>
      </footer>

      <NewProjectDialog open={isCreating} onClose={() => setIsCreating(false)} />
    </AppLayout>
  );
}
