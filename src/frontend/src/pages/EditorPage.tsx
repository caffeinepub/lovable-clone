import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  useProject,
  useChatHistory,
  useSendMessage,
  useUpdateProject,
  useUpdateProjectStatus,
} from "../hooks/useQueries";
import type { ChatMessage } from "../backend.d";
import { ProjectStatus } from "../backend.d";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Globe,
  Loader2,
  Send,
  Sparkles,
  MoreHorizontal,
  Share2,
  Settings,
  Monitor,
  Smartphone,
  RotateCcw,
  ExternalLink,
  Bot,
  User,
  Code2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── AI Responses ──────────────────────────────────────────
const AI_RESPONSES = [
  "I've analyzed your request and made the necessary updates. The changes are reflected in the preview on the right.",
  "Done! I've updated the component with the changes you described. Take a look at the preview to see how it looks.",
  "I've implemented that feature for you. The code has been updated and you can see the result in the preview panel.",
  "Great idea! I've made those changes. The component now includes the new functionality you requested.",
  "I've refactored that section to be cleaner and more maintainable. The updated version is visible in the preview.",
  "I've added the new section you described. It's been styled to match the rest of your app and is ready to preview.",
  "Those changes look great! I've updated the styling and layout. Check the preview to see the improved version.",
  "I've integrated that functionality into your existing code. Everything should be working smoothly in the preview.",
];

// ── Typing indicator ──────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2 mb-4"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
      >
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="msg-bubble-assistant px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Message bubble ────────────────────────────────────────
function MessageBubble({ msg, isLast }: { msg: ChatMessage; isLast: boolean }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-end gap-2 mb-4", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: isUser
            ? "oklch(0.15 0.01 260)"
            : "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))",
        }}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[80%]", isUser ? "items-end flex flex-col" : "items-start flex flex-col")}>
        <div
          className={cn(
            "px-4 py-3 text-sm leading-relaxed",
            isUser ? "msg-bubble-user text-white" : "msg-bubble-assistant text-foreground"
          )}
        >
          {msg.content}
        </div>
        {isLast && (
          <span className="text-[10px] text-muted-foreground/50 mt-1 px-1">
            {isUser ? "You" : "Lovable AI"}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Preview panel ─────────────────────────────────────────
function PreviewPanel({ projectName }: { projectName: string }) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0 bg-white">
        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-xs text-muted-foreground min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate font-mono">
            preview.lovable.app/{projectName.toLowerCase().replace(/\s+/g, "-")}
          </span>
          <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("desktop")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "desktop" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Desktop view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mobile")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "mobile" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Mobile view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Refresh preview"
        >
          <RotateCcw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
        </button>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-hidden bg-secondary/30 flex items-start justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "bg-white rounded-xl shadow-md overflow-hidden h-full",
              viewMode === "desktop" ? "w-full" : "w-[375px]"
            )}
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {/* Mock app content */}
            <div className="h-full overflow-auto">
              {/* Mock nav */}
              <div className="h-12 border-b border-gray-100 flex items-center px-5 gap-4">
                <div className="w-20 h-5 bg-gradient-to-r from-rose-400 to-orange-400 rounded" />
                <div className="flex-1" />
                <div className="w-16 h-6 bg-gray-100 rounded" />
                <div className="w-16 h-6 bg-gray-100 rounded" />
                <div className="w-20 h-7 rounded-lg" style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }} />
              </div>

              {/* Mock hero */}
              <div className="px-8 py-12 text-center" style={{ background: "linear-gradient(135deg, oklch(0.97 0.02 25 / 0.3), oklch(0.97 0.02 285 / 0.2))" }}>
                <div className="w-32 h-4 bg-gray-200 rounded-full mx-auto mb-3" />
                <div className="w-64 h-8 bg-gray-300 rounded-lg mx-auto mb-3" />
                <div className="w-48 h-4 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="flex items-center justify-center gap-3">
                  <div className="w-28 h-9 rounded-lg" style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }} />
                  <div className="w-28 h-9 rounded-lg border border-gray-200 bg-white" />
                </div>
              </div>

              {/* Mock features */}
              <div className="px-8 py-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 mb-3" />
                    <div className="w-3/4 h-3 bg-gray-200 rounded mb-2" />
                    <div className="w-full h-2 bg-gray-100 rounded mb-1" />
                    <div className="w-2/3 h-2 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Editor Page ───────────────────────────────────────────
export function EditorPage() {
  const { projectId } = useParams({ from: "/editor/$projectId" });
  const { data: project, isLoading } = useProject(projectId);
  const { data: backendMessages } = useChatHistory(projectId);
  const sendMessage = useSendMessage();
  const updateStatus = useUpdateProjectStatus();

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (backendMessages && backendMessages.length > 0) {
      setLocalMessages(backendMessages);
    }
  }, [backendMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    const content = inputValue.trim();
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      content,
      role: "user",
      projectId,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);

    try {
      await sendMessage.mutateAsync({ projectId, role: "user", content });
    } catch {
      // Continue with optimistic update
    }

    setIsTyping(true);

    setTimeout(async () => {
      setIsTyping(false);
      const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

      const tempAiMsg: ChatMessage = {
        id: `temp-ai-${Date.now()}`,
        content: aiResponse,
        role: "assistant",
        projectId,
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      };
      setLocalMessages((prev) => [...prev, tempAiMsg]);

      try {
        await sendMessage.mutateAsync({ projectId, role: "assistant", content: aiResponse });
      } catch {
        // Silently ignore
      }
    }, 1200 + Math.random() * 600);
  }, [inputValue, isTyping, projectId, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const newStatus =
        project?.status === ProjectStatus.live ? ProjectStatus.draft : ProjectStatus.live;
      await updateStatus.mutateAsync({ id: projectId, status: newStatus });
      toast.success(newStatus === ProjectStatus.live ? "Published successfully!" : "Unpublished");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsPublishing(false);
    }
  };

  const isLive = project?.status === ProjectStatus.live;

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="h-14 border-b border-border flex items-center gap-4 px-4 bg-white">
          <Skeleton className="h-6 w-32" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[400px] border-r border-border flex flex-col">
            <div className="flex-1 p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={cn("flex gap-2", i % 2 === 0 && "flex-row-reverse")}>
                  <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                  <Skeleton className={cn("h-12 rounded-xl", i % 2 === 0 ? "w-48" : "w-64")} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-secondary/30">
            <Skeleton className="m-6 h-[calc(100%-48px)] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* ── TOP BAR ────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0 bg-white">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Projects</span>
        </Link>

        <div className="w-px h-4 bg-border" />

        {/* Project name */}
        <h1 className="text-sm font-semibold font-display text-foreground truncate max-w-[200px]">
          {project?.name ?? "Untitled"}
        </h1>

        {project?.status === ProjectStatus.building && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            <Loader2 className="w-3 h-3 animate-spin" />
            Building
          </span>
        )}

        <div className="flex-1" />

        {/* Tab toggle */}
        <div className="hidden md:flex items-center border border-border rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              activeTab === "preview"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              activeTab === "code"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code
          </button>
        </div>

        {/* Actions */}
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </Button>

        <button
          type="button"
          onClick={() => void handlePublish()}
          disabled={isPublishing}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
            isLive
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
              : "btn-pink"
          )}
        >
          {isPublishing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Globe className="w-3.5 h-3.5" />
          )}
          {isLive ? "Published" : "Publish"}
        </button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </header>

      {/* ── MAIN LAYOUT ──────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: CHAT PANEL ─────────────────── */}
        <div className="w-[400px] shrink-0 border-r border-border flex flex-col bg-white">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold font-display text-foreground">Lovable AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 ml-auto">
              online
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scroll px-4 py-5">
            {localMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center text-center pt-8"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.94 0.04 340))" }}
                >
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Hi! I&apos;m Lovable AI</p>
                <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                  Tell me what you&apos;d like to change or add to your app. I can update components, add features, or redesign sections.
                </p>

                {/* Suggestion chips */}
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  {[
                    "Add a pricing section",
                    "Make it mobile responsive",
                    "Change the color scheme",
                    "Add a contact form",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setInputValue(suggestion);
                        textareaRef.current?.focus();
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-white hover:border-primary/30 hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {localMessages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isLast={i === localMessages.length - 1}
                  />
                ))}
                {isTyping && <TypingIndicator />}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="shrink-0 p-3 border-t border-border">
            <div className="prompt-container flex items-end gap-2 p-3">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask Lovable to add features, fix bugs, or redesign..."
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[20px] max-h-[120px] leading-relaxed"
                rows={1}
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  inputValue.trim() && !isTyping
                    ? "btn-pink"
                    : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                )}
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* ── RIGHT: PREVIEW / CODE PANEL ────────── */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "preview" ? (
            <PreviewPanel projectName={project?.name ?? "app"} />
          ) : (
            <div className="h-full flex flex-col">
              <div className="px-4 py-2.5 border-b border-border bg-secondary/30 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Code Editor</span>
                <span className="text-xs text-muted-foreground/50 ml-auto">Read-only preview</span>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono-code text-sm bg-gray-950 text-gray-300">
                <div className="space-y-1 opacity-70">
                  <p className="text-blue-400">{"// App.tsx"}</p>
                  <p>{"import React from 'react';"}</p>
                  <p className="text-blue-400">{"import { useState } from 'react';"}</p>
                  <p>{" "}</p>
                  <p className="text-purple-400">{"export default function App() {"}</p>
                  <p className="pl-4">{"return ("}</p>
                  <p className="pl-8 text-green-400">{"<div className=\"min-h-screen\">"}</p>
                  <p className="pl-12 text-gray-400">{"// Your generated app code"}</p>
                  <p className="pl-8 text-green-400">{"</div>"}</p>
                  <p className="pl-4">{");"}</p>
                  <p>{"}"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
