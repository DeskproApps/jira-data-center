import { get } from "lodash";
import { baseRequest } from "./baseRequest";
import {
  findEpicLinkMeta,
  findSprintLinkMeta,
  buildCustomFieldMeta,
  extractCustomFieldValues,
  combineCustomFieldValueAndMeta,
} from "./utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueItem, JiraIssueDetails } from "./types";

/**
 * List linked issues
 */
export const listLinkedIssues = async (client: IDeskproClient, keys: string[]): Promise<IssueItem[]> => {
  if (!keys.length) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { issues: fullIssues } = await baseRequest<{ issues: any }>(client, {
    url: `/search`,
    queryParams: [
      `jql=${encodeURIComponent(`issueKey IN (${keys.join(",")})`)}`,
      "expand=editmeta,renderedFields",
    ].join("&"),
  });

  const issues = (fullIssues ?? []).reduce(
    (list: unknown[], issue: { key: string }) => ({ ...list, [issue.key]: issue }),
    {}
  );

  const epicKeys = (fullIssues ?? []).reduce((list: unknown[], issue: JiraIssueDetails) => {
    const meta = findEpicLinkMeta(issue) as { key: string } | null;
    if (!meta) {
      return list;
    }

    if (!get(issue, ["fields", meta.key])) {
      return list;
    }

    return {...list, [issue.key]: get(issue, ["fields", meta.key])};
  }, {});

  const sprints = (fullIssues ?? []).reduce((list: unknown[], issue: JiraIssueDetails) => {
    const meta = findSprintLinkMeta(issue) as { key: string } | null;
    if (!meta) {
      return list;
    }

    if (!get(issue, ["fields", meta.key])) {
      return list;
    }

    return {...list, [issue.key]: get(issue, ["fields", meta.key])};
  }, {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let epics: { [key: string]: any } = {};

  if (Object.values(epicKeys).length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { issues: fullEpics } = await baseRequest<{ issues: any }>(client, {
      url: `/search`,
      queryParams: `jql=${encodeURIComponent(`issueKey IN (${Object.values(epicKeys).join(",")})`)}`,
    });

    epics = (fullEpics ?? []).reduce(
      (list: unknown[], issue: { key: string }) => ({ ...list, [issue.key]: issue }),
      {}
    );
  }

  return (fullIssues ?? []).map((issue: JiraIssueDetails) => ({
    id: issue.id,
    key: issue.key,
    summary: get(issue, ["fields", "summary"], "-"),
    status: get(issues, [issue.key, "fields", "status", "name"], "-"),
    projectKey: get(issues, [issue.key, "fields", "project", "key"], "-"),
    projectName: get(issues, [issue.key, "fields", "project", "name"], "-"),
    reporterId: get(issues, [issue.key, "fields", "reporter", "accountId"], ""),
    reporterName: get(issues, [issue.key, "fields", "reporter", "displayName"], "-"),
    reporterAvatarUrl: get(issues, [issue.key, "fields", "reporter", "avatarUrls", "24x24"], ""),
    assigneeId: get(issues, [issue.key, "fields", "assignee", "accountId"], ""),
    assigneeName: get(issues, [issue.key, "fields", "assignee", "displayName"], "-"),
    assigneeAvatarUrl: get(issues, [issue.key, "fields", "assignee", "avatarUrls", "24x24"], ""),
    epicKey: epics[epicKeys[issue.key]] ? epics[epicKeys[issue.key]].key : undefined,
    epicName: epics[epicKeys[issue.key]] ? epics[epicKeys[issue.key]].fields.summary : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sprints: (sprints[issue.key] ?? []).map((sprint: any) => ({
      sprintBoardId: sprint.boardId,
      sprintName: sprint.name,
      sprintState: sprint.state,
    })),
    description: get(issues, [issue.key, "renderedFields", "description"], "-"),
    labels: issues[issue.key].fields.labels ?? [],
    priority: issues[issue.key].fields.priority.name,
    priorityId: issues[issue.key].fields.priority.id,
    priorityIconUrl: issues[issue.key].fields.priority.iconUrl,
    customFields: combineCustomFieldValueAndMeta(
      extractCustomFieldValues(issue.fields),
      buildCustomFieldMeta(issue.editmeta.fields),
    ),
    parentKey: get(issues, [issue.key, "fields", "parent", "key"], null),
  }));
};
