import type { BlockType } from "../../types/blocks";
import { BLOCK_LIBRARY } from "../../types/blocks";
import {
  Sparkles,
  AlignLeft,
  Image,
  MousePointerClick,
  Columns2,
  PanelBottom,
  Layers,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  AlignLeft,
  Image,
  MousePointerClick,
  Columns2,
  PanelBottom,
};

interface BlockLibraryPanelProps {
  onAddBlock: (blockType: BlockType) => void;
}

export function BlockLibraryPanel({ onAddBlock }: BlockLibraryPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Blocks</span>
      </div>

      {/* Block list */}
      <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2">
          Click to add
        </p>
        {BLOCK_LIBRARY.map((item) => {
          const Icon = ICON_MAP[item.icon] || AlignLeft;
          return (
            <button
              type="button"
              key={item.type}
              onClick={() => onAddBlock(item.type)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left",
                "border border-border/50 bg-card",
                "hover:border-primary/50 hover:bg-primary/5",
                "transition-all duration-150 group"
              )}
            >
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground leading-none mb-1">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">
                  {item.description}
                </p>
              </div>
              <Plus className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-0.5 transition-colors ml-auto" />
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Drag blocks to reorder on canvas
        </p>
      </div>
    </div>
  );
}
