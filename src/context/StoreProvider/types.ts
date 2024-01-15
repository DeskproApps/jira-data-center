import type { Context } from "@deskpro/app-sdk";
import type { Reducer } from "react";
import type { Maybe, TicketContext } from "../../types";
import type {
  IssueDeps,
  IssueItem,
  JiraComment,
  IssueAttachment,
} from "../../services/jira/types";

export type StoreReducer = Reducer<State, Action>;

export type Dispatch = (action: Action) => void;

export interface State {
  context?: TicketContext;
  linkIssueSearchResults?: { loading: boolean, list: IssueItem[] };
  linkedIssuesResults?: { loading: boolean, list: IssueItem[] };
  linkedIssueAttachments?: { loading: boolean, list: { [key: string]: IssueAttachment[] } };
  dataDependencies?: IssueDeps;
  hasGeneratedIssueFormSuccessfully?: boolean;
  isUnlinkingIssue?: boolean;
  issueComments?: Record<string, JiraComment[]>;
  _error?: Error|unknown;
}

export type Action =
  | { type: "loadContext", context: Context }
  | { type: "linkIssueSearchListLoading" }
  | { type: "linkIssueSearchList", list: IssueItem[] }
  | { type: "linkIssueSearchListReset" }
  | { type: "linkedIssuesListLoading" }
  | { type: "linkedIssuesList", list: IssueItem[] }
  | { type: "unlinkIssue", key: string }
  | { type: "issueAttachmentsLoading" }
  | { type: "issueAttachments", key: string, attachments: IssueAttachment[] }
  | { type: "loadDataDependencies", deps: IssueDeps }
  | { type: "failedToGenerateIssueForm" }
  | { type: "error", error: Maybe<string> }
  | { type: "issueComments", key: string, comments: JiraComment[] }
;
