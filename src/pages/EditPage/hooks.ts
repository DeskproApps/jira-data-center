import { useMemo } from "react";
import { get } from "lodash";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getIssueByKey,
  getIssueAttachments,
} from "../../services/jira";
import { useAdfToPlainText } from "../../hooks";
import {
  buildCustomFieldMeta,
  formatCustomFieldValueForSet,
} from "../../services/jira/utils";
import { QueryKey } from "../../query";
import type {IssueMeta, Maybe} from "../../types";
import type { AttachmentFile, IssueFormData, IssueItem, JiraIssueDetails } from "../../services/jira/types";

type UseIssueDeps = (issueKey?: Maybe<IssueItem["key"]>) => {
  isLoading: boolean,
  values: IssueFormData,
  editMeta: Record<string, IssueMeta>,
  issue?: JiraIssueDetails,
};

const useIssueDeps: UseIssueDeps = (issueKey) => {
  const adfToPlainText = useAdfToPlainText();

  const issue = useQueryWithClient(
    [QueryKey.ISSUE, issueKey as IssueItem["key"]],
    (client) => getIssueByKey(client, issueKey as IssueItem["key"]),
    { enabled: Boolean(issueKey) },
  );

  const attachments = useQueryWithClient(
    [QueryKey.ATTACHMENTS, issueKey as IssueItem["key"]],
    (client) => getIssueAttachments(client, issueKey as IssueItem["key"]),
    { enabled: Boolean(issueKey) },
  );

  const editMeta: Record<string, IssueMeta> = useMemo(() => {
    return buildCustomFieldMeta(issue.data?.editmeta.fields ?? {})
  }, [issue.data]);

  const values = useMemo(() => ({
    attachments: (attachments?.data || []).map((a) => ({
      id: a.id,
      name: a.filename,
      size: a.sizeBytes,
    } as AttachmentFile)),
    summary: get(issue.data, ["fields", "summary"], ""),
    description: adfToPlainText(get(issue.data, ["fields", "description"])),
    issueTypeId: get(issue.data, ["fields", "issuetype", "id"], ""),
    projectId: get(issue.data, ["fields", "project", "id"], ""),
    reporterUserId: get(issue.data, ["fields", "reporter", "name"], ""),
    assigneeUserId: get(issue.data, ["fields", "assignee", "name"], ""),
    labels: get(issue.data, ["fields", "labels"], []) || [],
    priority: get(issue.data, ["fields", "priority", "id"], ""),
    customFields: Object.keys(editMeta).reduce((fields, key) => {
      const value = formatCustomFieldValueForSet(editMeta[key], get(issue.data, ["fields", key], null));

      if (value === undefined) {
        return fields;
      }

      return {
        ...fields,
        [key]: formatCustomFieldValueForSet(editMeta[key], get(issue.data, ["fields", key], null)),
      };
    }, {}),
    parentKey: get(issue.data, ["fields", "parent", "key"], ""),
  }), [issue.data, attachments.data, adfToPlainText, editMeta]);

  return {
    isLoading: [issue, attachments].some(({ isLoading }) => isLoading),
    issue: issue.data,
    values,
    editMeta,
  };
};

export { useIssueDeps };
