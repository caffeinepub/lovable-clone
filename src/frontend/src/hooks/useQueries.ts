import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type {
  Project,
  ChatMessage,
  Template,
  UserSettings,
  UserProfile,
  ProjectStatus,
} from "../backend.d";

// ============================================================
// Projects
// ============================================================

export function useUserProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["userProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProject(id: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Project | null>({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProject(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      prompt,
    }: {
      name: string;
      description: string;
      prompt: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createProject(name, description, prompt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      prompt,
    }: {
      id: string;
      name: string;
      description: string;
      prompt: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProject(id, name, description, prompt);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
  });
}

export function useUpdateProjectStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProjectStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProjectStatus(id, status);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
    },
  });
}

// ============================================================
// Chat
// ============================================================

export function useChatHistory(projectId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory", projectId],
    queryFn: async () => {
      if (!actor || !projectId) return [];
      return actor.getChatHistory(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      role,
      content,
    }: {
      projectId: string;
      role: string;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.sendMessage(projectId, role, content);
    },
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory", projectId] });
    },
  });
}

// ============================================================
// Templates
// ============================================================

export function useAllTemplates() {
  const { actor, isFetching } = useActor();
  return useQuery<Template[]>({
    queryKey: ["allTemplates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTemplates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTemplatesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Template[]>({
    queryKey: ["templates", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "all") return actor.getAllTemplates();
      return actor.getTemplatesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

// ============================================================
// Settings & Profile
// ============================================================

export function useUserSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<UserSettings | null>({
    queryKey: ["userSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error("No actor");
      return actor.saveUserSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ displayName, avatarUrl }: { displayName: string; avatarUrl: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createOrUpdateProfile(displayName, avatarUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
