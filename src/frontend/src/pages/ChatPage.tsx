import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";
import {
  useUserProjects,
  useChatHistory,
  useSendMessage,
  useCreateProject,
  useUpdateProjectStatus,
} from "../hooks/useQueries";
import type { ChatMessage, Project } from "../backend.d";
import { ProjectStatus } from "../backend.d";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Send,
  MessageSquare,
  Loader2,
  Sparkles,
  User,
  Bot,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AI_RESPONSES = [
  "I can help you build that! Let me set up the components and structure for you. The changes will be reflected in your project editor.",
  "Great idea! I've thought through the architecture and I think the best approach would be to use a clean component hierarchy with proper state management.",
  "I've analyzed your request. For the best user experience, I'd recommend a minimalist approach with focus on clarity and conversion optimization.",
  "That sounds like a fantastic project. I can help you build it from scratch or work with what you have. What would you like to start with?",
  "I've got some great ideas for this! We can make it both beautiful and highly functional. Where would you like to begin?",
];

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
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

function MessageBubble({ msg, index }: { msg: ChatMessage; index: number }) {
  const isUser = msg.role === "user";
  const ts = new Date(Number(msg.timestamp) / 1_000_000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      className={cn("flex items-end gap-2 mb-4", isUser && "flex-row-reverse")}
    >
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

      <div className={cn("max-w-[75%]", isUser && "items-end flex flex-col")}>
        <div
          className={cn(
            "px-4 py-3 text-sm leading-relaxed",
            isUser ? "msg-bubble-user text-white" : "msg-bubble-assistant text-foreground"
          )}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-muted-foreground/50 mt-1 px-1">
          {ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

function ProjectSidebarItem({
  project,
  isActive,
  onSelect,
}: {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
}) {
  const colorSeed = project.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hues = [25, 285, 160, 200, 50, 340, 265];
  const hue = hues[colorSeed % hues.length];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
        isActive
          ? "bg-primary/8 border border-primary/20"
          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, oklch(0.94 0.06 ${hue}), oklch(0.96 0.04 ${(hue + 40) % 360}))`,
        }}
      />
      <span className={cn("text-sm truncate flex-1", isActive ? "font-medium text-foreground" : "")}>
        {project.name}
      </span>
      {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />}
    </button>
  );
}

export function ChatPage() {
  const navigate = useNavigate();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: projects, isLoading: projectsLoading } = useUserProjects();
  const { data: backendMessages, isLoading: historyLoading } = useChatHistory(activeProjectId);
  const sendMessage = useSendMessage();
  const createProject = useCreateProject();
  const updateStatus = useUpdateProjectStatus();

  useEffect(() => {
    if (backendMessages) setLocalMessages(backendMessages);
  }, [backendMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setLocalMessages([]);
  };

  const handleNewProject = async () => {
    try {
      const id = await createProject.mutateAsync({
        name: `Chat Project ${new Date().toLocaleDateString()}`,
        description: "",
        prompt: "",
      });
      await updateStatus.mutateAsync({ id, status: ProjectStatus.building });
      setActiveProjectId(id);
      setLocalMessages([]);
      toast.success("New project created");
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !activeProjectId || isTyping) return;

    const content = inputValue.trim();
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const tempUserMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      content,
      role: "user",
      projectId: activeProjectId,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);

    try {
      await sendMessage.mutateAsync({ projectId: activeProjectId, role: "user", content });
    } catch {
      // Continue
    }

    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      const aiResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const tempAiMsg: ChatMessage = {
        id: `temp-ai-${Date.now()}`,
        content: aiResponse,
        role: "assistant",
        projectId: activeProjectId,
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      };
      setLocalMessages((prev) => [...prev, tempAiMsg]);
      try {
        await sendMessage.mutateAsync({ projectId: activeProjectId, role: "assistant", content: aiResponse });
      } catch {
        // Silently ignore
      }
    }, 1200 + Math.random() * 500);
  }, [inputValue, activeProjectId, isTyping, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const sortedProjects = (projects ?? [])
    .slice()
    .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));

  return (
    <AppLayout title="Chat" breadcrumbs={[{ label: "Chat" }]}>
      <div className="flex h-[calc(100vh-57px)] overflow-hidden">
        {/* ── Project sidebar ─────────────────────── */}
        <aside className="w-64 shrink-0 border-r border-border flex flex-col overflow-hidden bg-white">
          <div className="px-3 py-3 border-b border-border shrink-0">
            <button
              type="button"
              onClick={() => void handleNewProject()}
              disabled={createProject.isPending}
              className="w-full btn-pink py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createProject.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll px-2 py-3 space-y-0.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Recent projects
            </p>
            {projectsLoading ? (
              <div className="space-y-2 px-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
              </div>
            ) : sortedProjects.length > 0 ? (
              sortedProjects.map((project) => (
                <ProjectSidebarItem
                  key={project.id}
                  project={project}
                  isActive={activeProjectId === project.id}
                  onSelect={() => handleSelectProject(project.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No projects yet</p>
              </div>
            )}
          </div>
        </aside>

        {/* ── Chat area ───────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {activeProjectId ? (
            <>
              {/* Chat header */}
              <div className="shrink-0 px-5 py-3 border-b border-border flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.2 340))" }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold font-display text-foreground">
                    {sortedProjects.find((p) => p.id === activeProjectId)?.name ?? "Chat"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1.5"
                  onClick={() => navigate({ to: "/editor/$projectId", params: { projectId: activeProjectId } })}
                >
                  Open Editor
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto custom-scroll px-5 py-6">
                {historyLoading && localMessages.length === 0 ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={cn("flex items-end gap-2", i % 2 === 0 && "flex-row-reverse")}>
                        <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                        <Skeleton className={cn("h-12 rounded-2xl", i % 2 === 0 ? "w-48" : "w-64")} />
                      </div>
                    ))}
                  </div>
                ) : localMessages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.94 0.04 340))" }}
                    >
                      <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-base font-bold font-display text-foreground mb-2">
                      Start a conversation
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Describe what you want to build or modify. I&apos;ll help you create it.
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {localMessages.map((msg, i) => (
                      <MessageBubble key={msg.id} msg={msg} index={i} />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 px-5 pb-5 pt-3 border-t border-border bg-white">
                <div className="prompt-container flex items-end gap-2 p-3">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Lovable AI..."
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
                    aria-label="Send"
                  >
                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-6"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.94 0.04 340))" }}
              >
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold font-display text-foreground mb-2">
                AI-powered chat
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Select a project from the sidebar to chat with AI about your app, or start a new one.
              </p>
              <button
                type="button"
                onClick={() => void handleNewProject()}
                disabled={createProject.isPending}
                className="btn-pink px-5 py-2.5 text-sm flex items-center gap-2"
              >
                {createProject.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                New Chat
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
