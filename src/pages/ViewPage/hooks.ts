import { get } from "lodash";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  listLinkedIssues,
  getIssueComments,
  getIssueAttachments,
} from "../../services/jira";
import { QueryKey } from "../../query";
import type { Maybe } from "../../types";
import type { IssueItem, IssueAttachment, JiraComment } from "../../services/jira/types";

type UseIssue = (issueKey?: Maybe<IssueItem["key"]>) => {
  isLoading: boolean,
  issue: IssueItem|null,
  attachments: IssueAttachment[],
  comments: JiraComment[],
};

const useIssue: UseIssue = (issueKey) => {
  const issue = useQueryWithClient(
    [QueryKey.ISSUE, issueKey as IssueItem["key"]],
    (client) => listLinkedIssues(client, [issueKey as IssueItem["key"]]),
    { enabled: Boolean(issueKey) },
  );

  const attachments = useQueryWithClient(
    [QueryKey.ATTACHMENTS, issueKey as IssueItem["key"]],
    (client) => getIssueAttachments(client, issueKey as IssueItem["key"]),
    { enabled: Boolean(issueKey) },
  );

  const comments = useQueryWithClient(
    [QueryKey.ISSUE_COMMENTS, issueKey as IssueItem["key"]],
    (client) => getIssueComments(client, issueKey as IssueItem["key"]),
    { enabled: Boolean(issueKey) },
  );

  return {
    isLoading: [issue, attachments, comments].some(({ isLoading }) => isLoading),
    issue: get(issue, ["data", 0]),
    attachments: attachments.data || [],
    comments: comments.data || [],
  };
};

export { useIssue };
