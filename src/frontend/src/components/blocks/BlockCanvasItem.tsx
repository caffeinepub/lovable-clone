import { useState, useRef } from "react";
import type { BlockType } from "../../types/blocks";

// Legacy block type for block-based editor
interface Block { id: string; blockType: string; content: string; }
import { parseBlockContent } from "../../types/blocks";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  GripVertical,
  Sparkles,
  AlignLeft,
  Image,
  MousePointerClick,
  Columns2,
  PanelBottom,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BLOCK_ICONS: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  hero: Sparkles,
  text: AlignLeft,
  image: Image,
  button: MousePointerClick,
  columns: Columns2,
  footer: PanelBottom,
};

const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero",
  text: "Text",
  image: "Image",
  button: "Button",
  columns: "Columns",
  footer: "Footer",
};

interface BlockCanvasItemProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
  onDragStart?: (id: string) => void;
  onDragOver?: (id: string) => void;
  onDragEnd?: () => void;
}

function BlockCanvasPreview({ block }: { block: Block }) {
  const blockType = block.blockType as BlockType;
  const content = parseBlockContent(block.content, blockType);

  switch (blockType) {
    case "hero": {
      const c = content as { headline: string; subheadline: string; buttonLabel: string; backgroundImage: string };
      return (
        <div
          className="w-full h-32 flex items-center justify-center relative overflow-hidden rounded"
          style={{
            background: c.backgroundImage
              ? `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${c.backgroundImage}) center/cover`
              : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          <div className="text-center px-4">
            <p className="text-white font-bold text-base truncate max-w-xs">{c.headline}</p>
            <p className="text-white/60 text-xs mt-1 truncate max-w-xs">{c.subheadline}</p>
            {c.buttonLabel && (
              <span className="inline-block mt-2 bg-emerald-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                {c.buttonLabel}
              </span>
            )}
          </div>
        </div>
      );
    }
    case "text": {
      const c = content as { heading: string; body: string };
      return (
        <div className="p-3 bg-white rounded min-h-[60px]">
          {c.heading && (
            <p className="font-bold text-gray-900 text-sm mb-1 truncate">{c.heading}</p>
          )}
          <p className="text-gray-500 text-xs line-clamp-2">{c.body}</p>
        </div>
      );
    }
    case "image": {
      const c = content as { src: string; alt: string; caption: string };
      return (
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded min-h-[60px]">
          {c.src ? (
            <img src={c.src} alt={c.alt} className="h-14 w-20 object-cover rounded" />
          ) : (
            <div className="h-14 w-20 bg-gray-200 rounded flex items-center justify-center">
              <Image className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div>
            <p className="text-gray-600 text-xs">{c.alt || "Image"}</p>
            {c.caption && <p className="text-gray-400 text-xs mt-1 truncate max-w-[160px]">{c.caption}</p>}
          </div>
        </div>
      );
    }
    case "button": {
      const c = content as { label: string; variant: string };
      const variantStyles = {
        primary: "bg-emerald-500 text-black",
        secondary: "bg-gray-800 text-white",
        outline: "border-2 border-gray-800 text-gray-800",
      };
      return (
        <div className="p-3 bg-white rounded flex justify-center min-h-[52px] items-center">
          <span className={cn("text-xs font-semibold px-4 py-2 rounded-full", variantStyles[c.variant as keyof typeof variantStyles] || variantStyles.primary)}>
            {c.label}
          </span>
        </div>
      );
    }
    case "columns": {
      const c = content as { leftHeading: string; rightHeading: string };
      return (
        <div className="p-3 bg-gray-50 rounded grid grid-cols-2 gap-3 min-h-[60px]">
          <div>
            <p className="font-semibold text-gray-900 text-xs truncate">{c.leftHeading}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-xs truncate">{c.rightHeading}</p>
          </div>
        </div>
      );
    }
    case "footer": {
      const c = content as { companyName: string; tagline: string };
      return (
        <div className="p-3 bg-gray-900 rounded min-h-[52px]">
          <p className="text-white font-bold text-sm">{c.companyName}</p>
          {c.tagline && <p className="text-gray-400 text-xs mt-1 truncate">{c.tagline}</p>}
        </div>
      );
    }
    default:
      return <div className="p-3 bg-muted rounded text-xs text-muted-foreground">Unknown block</div>;
  }
}

export function BlockCanvasItem({
  block,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
  onDragStart,
  onDragOver,
  onDragEnd,
}: BlockCanvasItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const blockType = block.blockType as BlockType;
  const Icon = BLOCK_ICONS[blockType] || AlignLeft;
  const dragRef = useRef<HTMLElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    onDragStart?.(block.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver?.(block.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  return (
    <article
      ref={dragRef as React.RefObject<HTMLElement>}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      className={cn(
        "group relative rounded-lg border-2 transition-all duration-150 cursor-default",
        "hover:border-primary/50",
        isSelected
          ? "border-primary shadow-glow-sm"
          : "border-border",
        isDragging ? "opacity-40 scale-95" : "opacity-100 scale-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Block type label bar */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 border-b border-border/50",
        isSelected ? "bg-primary/10" : "bg-muted/50"
      )}>
        {/* Drag handle */}
        <span
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          aria-hidden="true"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </span>
        <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-primary" : "text-muted-foreground")} />
        <button
          type="button"
          className={cn("text-xs font-medium font-mono text-left flex-1", isSelected ? "text-primary" : "text-muted-foreground")}
          onClick={onSelect}
        >
          {BLOCK_LABELS[blockType]}
        </button>

        {/* Hover actions */}
        <div className={cn(
          "ml-auto flex items-center gap-1 transition-opacity duration-150",
          isHovered || isSelected ? "opacity-100" : "opacity-0"
        )}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={isFirst}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={isLast}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Block preview - clickable area */}
      <button type="button" className="p-2 overflow-hidden w-full text-left" onClick={onSelect}>
        <BlockCanvasPreview block={block} />
      </button>
    </article>
  );
}
