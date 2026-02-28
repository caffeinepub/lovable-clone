import type { BlockType } from "../../types/blocks";

// Legacy block type for block-based editor
interface Block { id: string; blockType: string; content: string; }
import { BlockPreview } from "../blocks/BlockPreview";
import { X, Monitor, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: Block[];
  projectName: string;
}

export function PreviewModal({ isOpen, onClose, blocks, projectName }: PreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "oklch(0.08 0.005 250)" }}
        >
          {/* Preview toolbar */}
          <div
            className="flex items-center gap-4 px-6 py-3 border-b shrink-0"
            style={{
              background: "oklch(0.11 0.008 250)",
              borderColor: "oklch(0.22 0.012 250)",
            }}
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold font-display text-foreground">
                Preview — {projectName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-4">
              <div className="h-2 w-2 rounded-full bg-red-500/60" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
              <div className="h-2 w-2 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 mx-4">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground font-mono max-w-sm mx-auto"
                style={{ background: "oklch(0.16 0.01 250)" }}
              >
                <ExternalLink className="w-3 h-3" />
                <span>preview.webcraft.app/{projectName.toLowerCase().replace(/\s+/g, "-")}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-auto">
            {/* Browser frame */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white min-h-full"
            >
              {blocks.length === 0 ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-300 mb-2">Empty Page</p>
                    <p className="text-gray-400">Add some blocks to preview your site</p>
                  </div>
                </div>
              ) : (
                <div>
                  {blocks.map((block) => (
                    <BlockPreview
                      key={block.id}
                      blockType={block.blockType as BlockType}
                      content={block.content}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
