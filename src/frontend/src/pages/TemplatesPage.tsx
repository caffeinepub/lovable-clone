import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { AppLayout } from "../components/AppLayout";
import { useAllTemplates, useCreateProject, useUpdateProjectStatus } from "../hooks/useQueries";
import { ProjectStatus } from "../backend.d";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Landing Page", "Dashboard", "E-commerce", "Blog", "Portfolio", "SaaS"];

// Static fallback templates if backend returns none
const FALLBACK_TEMPLATES = [
  { id: "t1", name: "SaaS Landing Page", category: "Landing Page", description: "A clean, conversion-focused landing page with hero, features, pricing, and CTA sections.", tags: ["react", "tailwind"], previewImageUrl: "" },
  { id: "t2", name: "Analytics Dashboard", category: "Dashboard", description: "Data-rich dashboard with charts, KPI cards, and real-time analytics views.", tags: ["react", "charts"], previewImageUrl: "" },
  { id: "t3", name: "E-commerce Store", category: "E-commerce", description: "Full-featured online store with product grid, cart, checkout, and order management.", tags: ["react", "stripe"], previewImageUrl: "" },
  { id: "t4", name: "Personal Blog", category: "Blog", description: "Clean blogging platform with markdown support, categories, and RSS feed.", tags: ["react", "mdx"], previewImageUrl: "" },
  { id: "t5", name: "Portfolio Site", category: "Portfolio", description: "Modern portfolio to showcase your work with project galleries and about section.", tags: ["react", "animation"], previewImageUrl: "" },
  { id: "t6", name: "Startup Homepage", category: "Landing Page", description: "Bold startup landing page with product demo, social proof, and waitlist form.", tags: ["react", "tailwind"], previewImageUrl: "" },
  { id: "t7", name: "Admin Panel", category: "Dashboard", description: "Feature-rich admin interface with user management, settings, and data tables.", tags: ["react", "table"], previewImageUrl: "" },
  { id: "t8", name: "SaaS App", category: "SaaS", description: "Complete SaaS boilerplate with auth, billing, dashboard, and settings.", tags: ["react", "auth"], previewImageUrl: "" },
  { id: "t9", name: "Restaurant Website", category: "Landing Page", description: "Appetizing restaurant site with menu, reservations, and location.", tags: ["react", "tailwind"], previewImageUrl: "" },
  { id: "t10", name: "Agency Website", category: "Landing Page", description: "Professional agency site with services, team, portfolio, and contact.", tags: ["react", "animation"], previewImageUrl: "" },
  { id: "t11", name: "Job Board", category: "SaaS", description: "Job listing platform with search, filters, company profiles, and applications.", tags: ["react", "search"], previewImageUrl: "" },
  { id: "t12", name: "Link in Bio", category: "Portfolio", description: "Beautiful link-in-bio page with social links and custom branding.", tags: ["react", "minimal"], previewImageUrl: "" },
];

const TEMPLATE_COLORS: Record<string, string> = {
  "Landing Page": "oklch(0.94 0.06 25 / 0.5)",
  "Dashboard": "oklch(0.94 0.05 285 / 0.5)",
  "E-commerce": "oklch(0.94 0.05 160 / 0.5)",
  "Blog": "oklch(0.95 0.05 60 / 0.5)",
  "Portfolio": "oklch(0.94 0.05 340 / 0.5)",
  "SaaS": "oklch(0.94 0.05 200 / 0.5)",
};

function TemplateCard({
  template,
  onUse,
  index,
}: {
  template: typeof FALLBACK_TEMPLATES[0];
  onUse: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className="lovable-card overflow-hidden group"
    >
      {/* Preview */}
      <div
        className="h-40 relative overflow-hidden"
        style={{ background: TEMPLATE_COLORS[template.category] ?? "oklch(0.95 0.03 260 / 0.5)" }}
      >
        {/* Mock wireframe */}
        <div className="absolute inset-0 p-4 flex flex-col gap-2.5 opacity-75">
          <div className="h-6 bg-white/60 rounded-lg w-2/5" />
          <div className="h-3 bg-white/40 rounded w-3/5" />
          <div className="h-3 bg-white/30 rounded w-2/5" />
          <div className="mt-1 h-12 bg-white/35 rounded-xl w-full" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-6 bg-white/25 rounded" />
            <div className="h-6 bg-white/20 rounded" />
            <div className="h-6 bg-white/22 rounded" />
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge className="text-[10px] bg-white/90 text-foreground border-0 shadow-sm">
            {template.category}
          </Badge>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-end p-3 pointer-events-none opacity-0 group-hover:opacity-100">
          <span
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full text-white flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
          >
            Use template
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground font-display mb-1">{template.name}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {template.description}
        </p>
        <button
          type="button"
          onClick={onUse}
          className="w-full py-2 rounded-xl text-sm font-semibold transition-all border border-border bg-white hover:border-primary/30 hover:bg-muted/20 text-foreground group-hover:btn-pink group-hover:border-0"
        >
          Use template
        </button>
      </div>
    </motion.div>
  );
}

export function TemplatesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [usingTemplateId, setUsingTemplateId] = useState<string | null>(null);

  const { data: backendTemplates } = useAllTemplates();
  const createProject = useCreateProject();
  const updateStatus = useUpdateProjectStatus();

  const templates = backendTemplates && backendTemplates.length > 0 ? backendTemplates : FALLBACK_TEMPLATES;

  const filteredTemplates = templates.filter((t) => {
    const matchCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleUseTemplate = async (template: typeof FALLBACK_TEMPLATES[0]) => {
    setUsingTemplateId(template.id);
    try {
      const id = await createProject.mutateAsync({
        name: template.name,
        description: template.description,
        prompt: `Create a ${template.category} named "${template.name}": ${template.description}`,
      });
      await updateStatus.mutateAsync({ id, status: ProjectStatus.building });
      navigate({ to: "/editor/$projectId", params: { projectId: id } });
      toast.success("Creating project from template...");
    } catch {
      toast.error("Failed to create project");
    } finally {
      setUsingTemplateId(null);
    }
  };

  return (
    <AppLayout title="Templates" breadcrumbs={[{ label: "Templates" }]}>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-black font-display text-foreground mb-1">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Get started faster with production-ready templates.
          </p>
        </motion.div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-9 h-9 border-border bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
                  selectedCategory === cat
                    ? "btn-pink border-0"
                    : "bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredTemplates.map((template, i) => (
              <div key={template.id} className="relative">
                {usingTemplateId === template.id && (
                  <div className="absolute inset-0 rounded-xl bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </div>
                  </div>
                )}
                <TemplateCard
                  template={template}
                  index={i}
                  onUse={() => void handleUseTemplate(template)}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.94 0.04 340))" }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-display text-foreground mb-2">No templates found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or category filter.</p>
          </motion.div>
        )}
      </div>

      <footer className="border-t border-border/50 py-4 px-6">
        <div className="max-w-6xl mx-auto">
        </div>
      </footer>
    </AppLayout>
  );
}
