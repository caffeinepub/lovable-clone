import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Crown, CheckCircle2, XCircle, Shield } from "lucide-react";

interface FounderModalProps {
  open: boolean;
  onClose: () => void;
}

export function FounderModal({ open, onClose }: FounderModalProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verified" | "denied">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVerify = () => {
    if (code.trim().toLowerCase() === "sivaparvathi") {
      setStatus("verified");
    } else {
      setStatus("denied");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerify();
  };

  const handleClose = () => {
    setCode("");
    setStatus("idle");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0.1 0 0 / 0.45)", backdropFilter: "blur(4px)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-7">
              {/* Avatar */}
              <div className="relative mb-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black font-display shadow-md"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
                  }}
                >
                  UV
                </div>
                {status === "verified" && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-amber-400 bg-white shadow border border-amber-200"
                  >
                    <Crown className="w-4 h-4 fill-amber-400" />
                  </motion.div>
                )}
              </div>

              {/* Name */}
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black font-display text-foreground tracking-tight">
                  UPPALAPATI VYSHNAV
                </h2>
                {status === "verified" && (
                  <Crown className="w-5 h-5 text-amber-400 fill-amber-300 shrink-0" />
                )}
              </div>
              <p className="text-sm font-semibold text-primary">Founder &amp; CEO</p>
              <p className="text-sm text-muted-foreground mt-1">
                The visionary behind this platform.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border mb-6" />

            {/* Founder badge info */}
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-6"
              style={{
                background: "oklch(0.97 0.03 25 / 0.5)",
                border: "1px solid oklch(0.62 0.22 25 / 0.15)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
                }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">Founder Access</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter the secret founder code to verify your identity and unlock founder privileges.
                </p>
              </div>
            </div>

            {/* Code input */}
            <div className="space-y-3">
              <label
                htmlFor="founder-code"
                className="block text-sm font-semibold text-foreground"
              >
                Enter Founder Code
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="founder-code"
                  type="password"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter secret code..."
                  className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  className="btn-pink px-4 py-2 text-sm font-semibold shrink-0"
                >
                  Verify
                </button>
              </div>

              {/* Status banners */}
              <AnimatePresence mode="wait">
                {status === "verified" && (
                  <motion.div
                    key="verified"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold"
                    style={{
                      background: "oklch(0.96 0.08 145 / 0.2)",
                      border: "1px solid oklch(0.55 0.18 145 / 0.35)",
                      color: "oklch(0.42 0.18 145)",
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>✓ Identity Confirmed — You are the Founder, UPPALAPATI VYSHNAV!</span>
                  </motion.div>
                )}
                {status === "denied" && (
                  <motion.div
                    key="denied"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold"
                    style={{
                      background: "oklch(0.97 0.06 25 / 0.2)",
                      border: "1px solid oklch(0.62 0.22 25 / 0.35)",
                      color: "oklch(0.50 0.22 25)",
                    }}
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Incorrect code. Access denied.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
