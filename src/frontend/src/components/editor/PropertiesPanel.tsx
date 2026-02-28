import type { BlockType, HeroContent, TextContent, ImageContent, ButtonContent, ColumnsContent, FooterContent } from "../../types/blocks";

// Legacy block type for block-based editor
interface Block { id: string; blockType: string; content: string; }
import { parseBlockContent } from "../../types/blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  AlignLeft,
  Image,
  MousePointerClick,
  Columns2,
  PanelBottom,
  Settings2,
} from "lucide-react";

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (blockId: string, content: string) => void;
}

const BLOCK_ICONS: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  hero: Sparkles,
  text: AlignLeft,
  image: Image,
  button: MousePointerClick,
  columns: Columns2,
  footer: PanelBottom,
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </Label>
      {children}
    </div>
  );
}

function HeroProperties({
  content,
  onChange,
}: {
  content: HeroContent;
  onChange: (c: HeroContent) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldGroup label="Headline">
        <Input
          value={content.headline}
          onChange={(e) => onChange({ ...content, headline: e.target.value })}
          placeholder="Enter headline"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Subheadline">
        <Textarea
          value={content.subheadline}
          onChange={(e) => onChange({ ...content, subheadline: e.target.value })}
          placeholder="Enter subheadline"
          rows={2}
          className="text-sm bg-input border-border resize-none"
        />
      </FieldGroup>
      <FieldGroup label="Button Label">
        <Input
          value={content.buttonLabel}
          onChange={(e) => onChange({ ...content, buttonLabel: e.target.value })}
          placeholder="Button text"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Button URL">
        <Input
          value={content.buttonUrl}
          onChange={(e) => onChange({ ...content, buttonUrl: e.target.value })}
          placeholder="https://..."
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Background Image URL">
        <Input
          value={content.backgroundImage}
          onChange={(e) => onChange({ ...content, backgroundImage: e.target.value })}
          placeholder="https://..."
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
    </div>
  );
}

function TextProperties({
  content,
  onChange,
}: {
  content: TextContent;
  onChange: (c: TextContent) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldGroup label="Heading">
        <Input
          value={content.heading}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          placeholder="Section heading"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Body Text">
        <Textarea
          value={content.body}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          placeholder="Write your content..."
          rows={5}
          className="text-sm bg-input border-border resize-none"
        />
      </FieldGroup>
    </div>
  );
}

function ImageProperties({
  content,
  onChange,
}: {
  content: ImageContent;
  onChange: (c: ImageContent) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldGroup label="Image URL">
        <Input
          value={content.src}
          onChange={(e) => onChange({ ...content, src: e.target.value })}
          placeholder="https://..."
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Alt Text">
        <Input
          value={content.alt}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          placeholder="Describe the image"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Caption">
        <Input
          value={content.caption}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          placeholder="Optional caption"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
    </div>
  );
}

function ButtonProperties({
  content,
  onChange,
}: {
  content: ButtonContent;
  onChange: (c: ButtonContent) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldGroup label="Label">
        <Input
          value={content.label}
          onChange={(e) => onChange({ ...content, label: e.target.value })}
          placeholder="Button text"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="URL">
        <Input
          value={content.url}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://..."
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Style">
        <Select
          value={content.variant}
          onValueChange={(v) =>
            onChange({ ...content, variant: v as ButtonContent["variant"] })
          }
        >
          <SelectTrigger className="h-8 text-sm bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary (Filled)</SelectItem>
            <SelectItem value="secondary">Secondary (Dark)</SelectItem>
            <SelectItem value="outline">Outline (Border)</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
    </div>
  );
}

function ColumnsProperties({
  content,
  onChange,
}: {
  content: ColumnsContent;
  onChange: (c: ColumnsContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        Left Column
      </div>
      <FieldGroup label="Heading">
        <Input
          value={content.leftHeading}
          onChange={(e) => onChange({ ...content, leftHeading: e.target.value })}
          placeholder="Left heading"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Body">
        <Textarea
          value={content.leftBody}
          onChange={(e) => onChange({ ...content, leftBody: e.target.value })}
          placeholder="Left content"
          rows={3}
          className="text-sm bg-input border-border resize-none"
        />
      </FieldGroup>
      <Separator className="my-2" />
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
        Right Column
      </div>
      <FieldGroup label="Heading">
        <Input
          value={content.rightHeading}
          onChange={(e) => onChange({ ...content, rightHeading: e.target.value })}
          placeholder="Right heading"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Body">
        <Textarea
          value={content.rightBody}
          onChange={(e) => onChange({ ...content, rightBody: e.target.value })}
          placeholder="Right content"
          rows={3}
          className="text-sm bg-input border-border resize-none"
        />
      </FieldGroup>
    </div>
  );
}

function FooterProperties({
  content,
  onChange,
}: {
  content: FooterContent;
  onChange: (c: FooterContent) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldGroup label="Company Name">
        <Input
          value={content.companyName}
          onChange={(e) => onChange({ ...content, companyName: e.target.value })}
          placeholder="Your company name"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Tagline">
        <Input
          value={content.tagline}
          onChange={(e) => onChange({ ...content, tagline: e.target.value })}
          placeholder="Your tagline"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
      <FieldGroup label="Copyright">
        <Input
          value={content.copyright}
          onChange={(e) => onChange({ ...content, copyright: e.target.value })}
          placeholder="© 2026 My Company"
          className="h-8 text-sm bg-input border-border"
        />
      </FieldGroup>
    </div>
  );
}

export function PropertiesPanel({ selectedBlock, onUpdateBlock }: PropertiesPanelProps) {
  if (!selectedBlock) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
          <Settings2 className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No block selected</p>
        <p className="text-xs text-muted-foreground">
          Click a block on the canvas to edit its properties
        </p>
      </div>
    );
  }

  const blockType = selectedBlock.blockType as BlockType;
  const Icon = BLOCK_ICONS[blockType] || Settings2;

  function handleChange(newContent: unknown) {
    onUpdateBlock(selectedBlock!.id, JSON.stringify(newContent));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground capitalize">{blockType} Block</p>
          <p className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">{selectedBlock.id}</p>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4">
        {blockType === "hero" && (
          <HeroProperties
            content={parseBlockContent<HeroContent>(selectedBlock.content, "hero")}
            onChange={handleChange}
          />
        )}
        {blockType === "text" && (
          <TextProperties
            content={parseBlockContent<TextContent>(selectedBlock.content, "text")}
            onChange={handleChange}
          />
        )}
        {blockType === "image" && (
          <ImageProperties
            content={parseBlockContent<ImageContent>(selectedBlock.content, "image")}
            onChange={handleChange}
          />
        )}
        {blockType === "button" && (
          <ButtonProperties
            content={parseBlockContent<ButtonContent>(selectedBlock.content, "button")}
            onChange={handleChange}
          />
        )}
        {blockType === "columns" && (
          <ColumnsProperties
            content={parseBlockContent<ColumnsContent>(selectedBlock.content, "columns")}
            onChange={handleChange}
          />
        )}
        {blockType === "footer" && (
          <FooterProperties
            content={parseBlockContent<FooterContent>(selectedBlock.content, "footer")}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}
