import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";

import AccessControl "authorization/access-control";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProjectId = Text;
  type ChatSessionId = Text;
  type TemplateId = Text;
  type ChatMessageId = Text;
  type Timestamp = Int;

  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type ProjectStatus = {
    #building;
    #live;
    #draft;
  };

  public type Project = {
    id : ProjectId;
    owner : Principal;
    name : Text;
    description : Text;
    prompt : Text;
    status : ProjectStatus;
    previewUrl : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type ChatMessage = {
    id : ChatMessageId;
    projectId : ProjectId;
    role : Text; // "user" or "assistant"
    content : Text;
    timestamp : Timestamp;
  };

  public type Template = {
    id : TemplateId;
    name : Text;
    description : Text;
    category : Text;
    previewImageUrl : Text;
    tags : [Text];
  };

  public type UserSettings = {
    theme : Text; // "dark" or "light"
    notificationsEnabled : Bool;
    plan : Text; // "free" or "pro"
  };

  public type UserProfile = {
    displayName : Text;
    avatarUrl : Text;
    createdAt : Timestamp;
  };

  // Persistent storage maps
  let projects = Map.empty<ProjectId, Project>();
  let chatMessages = Map.empty<ChatMessageId, ChatMessage>();
  let templates = Map.empty<TemplateId, Template>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userSettings = Map.empty<Principal, UserSettings>();

  // ================= User Profile Functions =================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createOrUpdateProfile(displayName : Text, avatarUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let profile : UserProfile = {
      displayName;
      avatarUrl;
      createdAt = Time.now();
    };
    userProfiles.add(caller, profile);
  };

  // ================= Project Management Functions =================

  public shared ({ caller }) func createProject(name : Text, description : Text, prompt : Text) : async ProjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };
    let id = caller.toText() # "." # Time.now().toText();
    let project : Project = {
      id;
      owner = caller;
      name;
      description;
      prompt;
      status = #draft;
      previewUrl = "";
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    projects.add(id, project);
    id;
  };

  public query ({ caller }) func getUserProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their projects");
    };
    projects.values().toArray().filter(
      func(p) { p.owner == caller }
    );
  };

  public query ({ caller }) func getProject(id : ProjectId) : async ?Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (project.owner != caller and project.status != #live) {
          Runtime.trap("Unauthorized: project is not live and you are not the owner");
        };
        ?project;
      };
    };
  };

  public shared ({ caller }) func updateProject(
    id : ProjectId,
    name : Text,
    description : Text,
    prompt : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };
    let project = getProjectInternal(id);
    checkIsOwner(caller, project.owner);
    let updatedProject : Project = {
      id = project.id;
      owner = project.owner;
      name;
      description;
      prompt;
      status = project.status;
      previewUrl = project.previewUrl;
      createdAt = project.createdAt;
      updatedAt = Time.now();
    };
    projects.add(id, updatedProject);
  };

  public shared ({ caller }) func deleteProject(id : ProjectId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };
    let project = getProjectInternal(id);
    checkIsOwner(caller, project.owner);
    projects.remove(id);
  };

  public shared ({ caller }) func updateProjectStatus(id : ProjectId, status : ProjectStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update project status");
    };
    let project = getProjectInternal(id);
    checkIsOwner(caller, project.owner);
    let updatedProject : Project = {
      id = project.id;
      owner = project.owner;
      name = project.name;
      description = project.description;
      prompt = project.prompt;
      status;
      previewUrl = project.previewUrl;
      createdAt = project.createdAt;
      updatedAt = Time.now();
    };
    projects.add(id, updatedProject);
  };

  func getProjectInternal(id : ProjectId) : Project {
    switch (projects.get(id)) {
      case (null) {
        Runtime.trap("Project " # id # " not found");
      };
      case (?project) { project };
    };
  };

  func checkIsOwner(caller : Principal, owner : Principal) {
    if (caller != owner) {
      Runtime.trap("Unauthorized: You are not the owner of this project");
    };
  };

  // ================= Chat Management =================

  public shared ({ caller }) func sendMessage(projectId : ProjectId, role : Text, content : Text) : async ChatMessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: only users can send messages");
    };
    if (role != "user" and role != "assistant") {
      Runtime.trap("Invalid role. Must be 'user' or 'assistant'");
    };
    let project = getProjectInternal(projectId);
    checkIsOwner(caller, project.owner);
    let id = projectId # "." # Time.now().toText();
    let message : ChatMessage = {
      id;
      projectId;
      role;
      content;
      timestamp = Time.now();
    };
    chatMessages.add(id, message);
    id;
  };

  public query ({ caller }) func getChatHistory(projectId : ProjectId) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: only users can access chat history");
    };
    let project = getProjectInternal(projectId);
    checkIsOwner(caller, project.owner);
    chatMessages.values().toArray().filter(
      func(m) { m.projectId == projectId }
    );
  };

  // ================= Template Management =================
  // Templates are public - no authentication required

  public query func getAllTemplates() : async [Template] {
    templates.values().toArray();
  };

  public query func getTemplate(id : TemplateId) : async ?Template {
    templates.get(id);
  };

  public query func getTemplatesByCategory(category : Text) : async [Template] {
    templates.values().toArray().filter(
      func(t) { t.category == category }
    );
  };

  // ================= User Settings Management =================

  public shared ({ caller }) func saveUserSettings(settings : UserSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: only users can update settings");
    };
    userSettings.add(caller, settings);
  };

  public query ({ caller }) func getUserSettings() : async ?UserSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: only users can get settings");
    };
    userSettings.get(caller);
  };
};
