export type {
  SearchParams,
  IssueItem,
  IssueAttachment,
  IssueFormData,
  AttachmentFile,
  JiraErrorResponse,
  JiraComment,
  AvatarUrls,
  JiraUser,
  JiraUserInfo,
  PermissionKeys,
  Permission,
  Permissions,
  JiraIssueType,
  JiraProject,
  JiraFieldMeta,
  JiraPriorityValue,
  JiraFields,
  JiraIssueCustomFieldMeta,
  JiraIssueFieldMeta,
  JiraIssueSearch,
  JiraIssueDetails,
  SearchResponse,
} from "../../context/StoreProvider/types";

export type JiraAPIError = {
  errorMessages: string[],
  errors: object,
};

export type Response<T> = Promise<T>;

export type Pagination = {
  expand: string,
  startAt: number,
  maxResults: number,
  total: number,
};
