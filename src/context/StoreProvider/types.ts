import { Context } from "@deskpro/app-sdk";
import { Reducer } from "react";
import { ADFEntity } from "@atlaskit/adf-utils";
import {IssueMeta} from "../../types";

export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type StoreReducer = Reducer<State, Action>;

export type Dispatch = (action: Action) => void;

export type Page =
  "home"
  | "link"
  | "view"
  | "create"
  | "edit"
  | "comment"
  | "view_permissions"
  | "verify_settings"
;

export type IssueDeps = {
  createMeta: { expand: "projects", projects: JiraProject[] },
  labels: string[],
  projects: JiraProject[],
  users: JiraUserInfo[],
};

export interface State {
  page?: Page;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageParams?: any;
  context?: TicketContext;
  linkIssueSearchResults?: { loading: boolean, list: IssueSearchItem[] };
  linkedIssuesResults?: { loading: boolean, list: IssueItem[] };
  linkedIssueAttachments?: { loading: boolean, list: { [key: string]: IssueAttachment[] } };
  dataDependencies?: IssueDeps;
  hasGeneratedIssueFormSuccessfully?: boolean;
  isUnlinkingIssue?: boolean;
  issueComments?: Record<string, JiraComment[]>;
  _error?: Error|unknown;
}

export type Action =
  | { type: "changePage", page: Page, params?: object }
  | { type: "loadContext", context: Context }
  | { type: "linkIssueSearchListLoading" }
  | { type: "linkIssueSearchList", list: IssueSearchItem[] }
  | { type: "linkIssueSearchListReset" }
  | { type: "linkedIssuesListLoading" }
  | { type: "linkedIssuesList", list: IssueItem[] }
  | { type: "unlinkIssue", key: string }
  | { type: "issueAttachmentsLoading" }
  | { type: "issueAttachments", key: string, attachments: IssueAttachment[] }
  | { type: "loadDataDependencies", deps: IssueDeps }
  | { type: "failedToGenerateIssueForm" }
  | { type: "error", error: string }
  | { type: "issueComments", key: string, comments: JiraComment[] }
;

export type ElementEventPayload =
  | undefined
  | string
  | { action: "viewPermissions" }
  | { action: "unlink", issueKey: string };

export interface TicketContext extends Context {
  data: { ticket: { id: string, permalinkUrl: string, subject: string; } }
}

export interface SearchParams {
  withSubtask?: boolean;
  projectId?: string;
}

export interface IssueItem {
  id: number;
  key: string;
  summary: string;
  projectKey: string;
  projectName: string;
  status: string;
  reporterId: string;
  reporterName: string;
  reporterAvatarUrl: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatarUrl: string;
  epicKey?: string;
  epicName?: string;
  priority: string;
  priorityId: string;
  priorityIconUrl: string;
  sprints?: {
    sprintBoardId?: number;
    sprintName?: string;
    sprintState?: string;
  }[],
  description?: ADFEntity;
  labels?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFields: Record<string, { value: any, meta: IssueMeta }>;
  parentKey?: string;
}

export interface IssueSearchItem extends IssueItem {
  keyHtml: string;
  summaryHtml: string;
}

export interface IssueAttachment {
  id: number;
  filename: string;
  sizeBytes: number;
  sizeMb: number;
  url: string;
}

export interface IssueFormData {
  summary: string;
  description: string;
  issueTypeId: string;
  projectId: string;
  reporterUserId: string;
  assigneeUserId: string;
  labels: string[],
  priority: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFields: Record<string, any>;
  attachments: AttachmentFile[];
  parentKey: string;
}

export interface AttachmentFile {
  name: string;
  size: number;
  id?: number;
  file?: File;
  delete?: boolean;
}

export type JiraErrorResponse = {
  id: string,
  title: string,
  errorMessages?: Record<string, string>,
  errors?: Record<string, string>,
  status: number,
  additionalProperties: false
};

export class InvalidRequestResponseError extends Error {
  constructor(message: string, private _response: JiraErrorResponse) {
    super(message);
  }

  get response() {
    return this._response;
  }
}

export interface JiraComment {
  id: string;
  created: Date;
  updated: Date;
  body: ADFEntity;
  author: {
    accountId: string;
    displayName: string;
    avatarUrl: string;
  };
  renderedBody: string
}

export type AvatarUrls = {
  "16x16": string,
  "24x24": string,
  "32x32": string,
  "48x48": string,
};

export type JiraUser = {
  self: string,
  key: string,
  accountId: string,
  accountType: "atlassian"|"app",
  name: string,
  emailAddress: string,
  displayName: string,
  avatarUrls: AvatarUrls,
  active: boolean,
  timeZone: string,
  groups: object,
  applicationRoles: object,
};

export type JiraUserInfo = {
  accountId: string,
  accountType: "atlassian"|"app",
  active: boolean,
  avatarUrls: AvatarUrls,
  displayName: string,
  emailAddress: string,
  self: string,
  timeZone: string,
};

export type PermissionKeys =
  | "BROWSE_PROJECTS"
  | "CREATE_ISSUES"
  | "EDIT_ISSUES"
  | "ASSIGN_ISSUES"
  | "ADD_COMMENTS"
  | "MANAGE_WATCHERS"
;

export type Permissions = Record<PermissionKeys, {
  description: string,
  havePermission: boolean,
  id: string,
  key: PermissionKeys,
  name: string,
  type: "PROJECT",
}>;

export interface JiraIssueType {
  description: string
  expand: "fields",
  iconUrl: string,
  id: string,
  name: string,
  self: string,
  subtask: boolean,
  untranslatedName: string,
  fields: JiraFields,
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  self: string;
  expand: "issuetypes";
  avatarUrls: AvatarUrls;
  issuetypes: JiraIssueType[];
}

export type JiraFieldMeta = {
  key: string,
  fieldId: string,
  name: string,
  required: boolean,
  operations: string[], // set,copy,add,edit,remove
  autoCompleteUrl?: string,
  allowedValues?: Array<{ id: string, self: string, name?: string, value?: string }>,
  hasDefaultValue?: boolean,
};

export type JiraPriorityValue = { iconUrl: string, id: string, name: string, self: string, };

export type JiraFields = {
  summary: string,
  description: null|string,
  project: {
    avatarUrls: AvatarUrls,
    id: string, // "10001"
    key: string, // "DS"
    name: string,
    projectTypeKey: string,
    self: string, // "https://deskpro.atlassian.net/rest/api/2/project/10001"
    simplified: boolean,
  },
  issuetype: {
    avatarId: number,
    description: string,
    hierarchyLevel: number,
    iconUrl: string,
    id: string,
    name: string,
    self: string,
    subtask: boolean,
  },
  reporter: JiraUserInfo,
  assignee: JiraUserInfo,
  labels: string[],
  priority: {
    id: string,
    name: string,
    self: string,
    iconUrl: string,
    allowedValues?: JiraPriorityValue[],
  },
  parent: {
    id: string,
    key: string,
    self: string,
    fields: {
      summary: JiraIssueDetails["fields"]["summary"],
      issuetype: JiraIssueDetails["fields"]["issuetype"],
      priority: JiraIssueDetails["fields"]["priority"],
      status: JiraIssueDetails["fields"]["status"],
    },
  },
  status: {
    description: string,
    iconUrl: string,
    id: string,
    name: string,
    self: string,
    statusCategory: {
      id: number,
      key: string,
      name: string,
      self: string,
      colorName: string,
    }
  },
};

export type JiraIssueCustomFieldMeta = JiraFieldMeta & {
  schema: { custom: string, customId: number, type: string, items?: string },
};

export type JiraIssueFieldMeta = JiraFieldMeta & {
  schema: { system: string, type: string, items?: string },
};

export type JiraIssueSearch = {
  id: number,
  img: string,
  key: string,
  keyHtml: string,
  summary: string,
  summaryText: string,
};

export type JiraIssueDetails = {
  id: string,     // "10028"
  key: string,    // "DP-22"
  self: string,   // "https://deskpro.atlassian.net/rest/api/2/issue/10028",
  expand: string, // "renderedFields,names,schema,operations,editmeta,changelog,versionedRepresentations,customfield_10024.requestTypePractice"
  editmeta: {
    fields: Record<string, JiraIssueFieldMeta|JiraIssueCustomFieldMeta>,
  },
  fields: JiraFields
};

export type SearchResponse<T> = {
  nextPage: string,
  self: string,
  isLast: boolean,
  maxResults: number,
  startAt: number,
  total: number,
  values: T[],
};
