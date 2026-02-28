import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { AppLayout } from "../components/AppLayout";
import {
  useUserProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProjectStatus,
} from "../hooks/useQueries";
import type { Project } from "../backend.d";
import { ProjectStatus } from "../backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Plus,
  Edit3,
  Trash2,
  Globe,
  Loader2,
  Sparkles,
  Calendar,
  LayoutGrid,
  List,
  Search,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FilterType = "all" | "live" | "draft";

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectGridCard({
  project,
  index,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  project: Project;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const isLive = project.status === ProjectStatus.live;
  const colorSeed = project.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hues = [25, 285, 160, 200, 50, 340, 265];
  const hue = hues[colorSeed % hues.length];

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -2 }}
        className="lovable-card overflow-hidden group"
      >
        {/* Preview */}
        <button
          type="button"
          className="h-36 w-full relative overflow-hidden text-left block"
          onClick={onEdit}
          style={{
            background: `linear-gradient(135deg, oklch(0.94 0.06 ${hue} / 0.6), oklch(0.96 0.04 ${(hue + 40) % 360} / 0.4))`,
          }}
        >
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
          {isLive && (
            <div className="absolute top-2.5 left-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-emerald-600 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
            <span className="bg-white/95 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <Edit3 className="w-3 h-3" />
              Open Editor
            </span>
          </div>
        </button>

        {/* Body */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground font-display truncate mb-2 hover:text-primary transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] px-1.5 h-4",
                isLive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isLive ? "Live" : "Draft"}
            </Badge>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(project.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button type="button" size="sm" onClick={onEdit} className="flex-1 h-7 text-xs gap-1 btn-pink">
              <Edit3 className="w-3 h-3" />
              Open
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onTogglePublish}
              className="h-7 px-2 text-xs"
              title={isLive ? "Unpublish" : "Publish"}
            >
              <Globe className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirm(true)}
              className="h-7 px-2 text-xs hover:text-destructive hover:border-destructive/50"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.article>

      <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{project.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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

function ProjectListRow({
  project,
  index,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  project: Project;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const isLive = project.status === ProjectStatus.live;
  const colorSeed = project.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hues = [25, 285, 160, 200, 50, 340, 265];
  const hue = hues[colorSeed % hues.length];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, delay: index * 0.04 }}
        className="group flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary/20 hover:shadow-sm transition-all duration-150"
      >
        <div
          className="w-10 h-10 rounded-xl shrink-0"
          style={{
            background: `linear-gradient(135deg, oklch(0.94 0.06 ${hue}), oklch(0.96 0.04 ${(hue + 40) % 360}))`,
          }}
        />
        <div className="flex-1 min-w-0">
          <button
            type="button"
            className="text-sm font-semibold text-foreground font-display truncate hover:text-primary transition-colors w-full text-left"
            onClick={onEdit}
          >
            {project.name}
          </button>
          <div className="flex items-center gap-3 mt-0.5">
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] px-1.5 h-3.5",
                isLive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isLive ? "Live" : "Draft"}
            </Badge>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(project.updatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button type="button" size="sm" onClick={onEdit} className="h-7 text-xs gap-1 px-3 btn-pink">
            <Edit3 className="w-3 h-3" />
            Open
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onTogglePublish}
            className="h-7 px-2"
          >
            <Globe className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeleteConfirm(true)}
            className="h-7 px-2 hover:text-destructive hover:border-destructive/50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>

      <AlertDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{project.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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

export function ProjectsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const { data: projects, isLoading } = useUserProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const updateStatus = useUpdateProjectStatus();

  const filteredProjects = (projects ?? [])
    .slice()
    .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
    .filter((p) => {
      const matchFilter =
        filter === "all" ||
        (filter === "live" && p.status === ProjectStatus.live) ||
        (filter === "draft" && p.status !== ProjectStatus.live);
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

  const handleCreate = async () => {
    try {
      const id = await createProject.mutateAsync({
        name: "Untitled Project",
        description: "",
        prompt: "",
      });
      navigate({ to: "/editor/$projectId", params: { projectId: id } });
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const newStatus =
        project.status === ProjectStatus.live ? ProjectStatus.draft : ProjectStatus.live;
      await updateStatus.mutateAsync({ id: project.id, status: newStatus });
      toast.success(newStatus === ProjectStatus.live ? "Published!" : "Unpublished");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <AppLayout
      title="All Projects"
      breadcrumbs={[{ label: "All Projects" }]}
      actions={
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={createProject.isPending}
          className="btn-pink px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          {createProject.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          New project
        </button>
      }
    >
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black font-display text-foreground"
            >
              All Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-sm text-muted-foreground mt-0.5"
            >
              {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
            </motion.p>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 h-9 text-sm border-border bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "live", "draft"] as FilterType[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filter === f
                    ? "btn-pink"
                    : "bg-white border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}

            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as "grid" | "list")}
              className="border border-border rounded-lg p-0.5 bg-white"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view" className="h-7 w-7 rounded-md p-0 data-[state=on]:bg-secondary">
                <LayoutGrid className="w-3.5 h-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="h-7 w-7 rounded-md p-0 data-[state=on]:bg-secondary">
                <List className="w-3.5 h-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="lovable-card overflow-hidden">
                <Skeleton className="h-36 rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-7 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredProjects.map((project, i) => (
                  <ProjectGridCard
                    key={project.id}
                    project={project}
                    index={i}
                    onEdit={() => navigate({ to: "/editor/$projectId", params: { projectId: project.id } })}
                    onDelete={() => void handleDelete(project.id)}
                    onTogglePublish={() => void handleTogglePublish(project)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {filteredProjects.map((project, i) => (
                  <ProjectListRow
                    key={project.id}
                    project={project}
                    index={i}
                    onEdit={() => navigate({ to: "/editor/$projectId", params: { projectId: project.id } })}
                    onDelete={() => void handleDelete(project.id)}
                    onTogglePublish={() => void handleTogglePublish(project)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.94 0.04 340))" }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-display text-foreground mb-2">
              {search || filter !== "all" ? "No matching projects" : "No projects yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs">
              {search || filter !== "all"
                ? "Try adjusting your search or filters."
                : "Create your first project to get started."}
            </p>
            {!search && filter === "all" && (
              <button
                type="button"
                onClick={() => void handleCreate()}
                className="btn-pink px-5 py-2.5 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            )}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
