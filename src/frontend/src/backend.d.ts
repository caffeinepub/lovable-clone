import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type ChatMessageId = string;
export type TemplateId = string;
export interface UserSettings {
    theme: string;
    notificationsEnabled: boolean;
    plan: string;
}
export type ProjectId = string;
export interface Project {
    id: ProjectId;
    status: ProjectStatus;
    owner: Principal;
    previewUrl: string;
    name: string;
    createdAt: Timestamp;
    description: string;
    updatedAt: Timestamp;
    prompt: string;
}
export interface ChatMessage {
    id: ChatMessageId;
    content: string;
    role: string;
    projectId: ProjectId;
    timestamp: Timestamp;
}
export interface Template {
    id: TemplateId;
    name: string;
    tags: Array<string>;
    description: string;
    category: string;
    previewImageUrl: string;
}
export interface UserProfile {
    displayName: string;
    createdAt: Timestamp;
    avatarUrl: string;
}
export enum ProjectStatus {
    live = "live",
    building = "building",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(displayName: string, avatarUrl: string): Promise<void>;
    createProject(name: string, description: string, prompt: string): Promise<ProjectId>;
    deleteProject(id: ProjectId): Promise<void>;
    getAllTemplates(): Promise<Array<Template>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(projectId: ProjectId): Promise<Array<ChatMessage>>;
    getProject(id: ProjectId): Promise<Project | null>;
    getTemplate(id: TemplateId): Promise<Template | null>;
    getTemplatesByCategory(category: string): Promise<Array<Template>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjects(): Promise<Array<Project>>;
    getUserSettings(): Promise<UserSettings | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveUserSettings(settings: UserSettings): Promise<void>;
    sendMessage(projectId: ProjectId, role: string, content: string): Promise<ChatMessageId>;
    updateProject(id: ProjectId, name: string, description: string, prompt: string): Promise<void>;
    updateProjectStatus(id: ProjectId, status: ProjectStatus): Promise<void>;
}
