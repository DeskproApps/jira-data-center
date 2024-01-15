import { find, reduce, map, get } from "lodash";
import { baseRequest } from "./baseRequest";
import { findEpicLinkMeta } from "./utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type {
  IssueItem,
  SearchParams,
  JiraIssueSearch,
  JiraIssueDetails,
} from "./types";

/**
 * Search JIRA issues
 */
export const searchIssues = async (
  client: IDeskproClient,
  q: string,
  params: SearchParams = {},
): Promise<IssueItem[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { sections } = await baseRequest<{ sections: any }>(client, {
    url: "/issue/picker",
    method: "GET",
    queryParams: [
      `query=${encodeURIComponent(q)}`,
      `currentJQL=`,
      `showSubTasks=${params.withSubtask ? "true" : "false"}`,
      params.projectId ? `currentProjectId=${params.projectId}` : "",
    ].join("&"),
  });
  const { issues: searchIssues = [] } = find(sections, { id: "cs" });
  const { issues: historyIssues = [] } = find(sections, { id: "hs" });
  const allIssues: JiraIssueSearch[] = reduce(
    [...searchIssues, ...historyIssues],
    (acc: JiraIssueSearch[], issue) => {
      const currentIssue = find(acc, { key: issue.key })
      if (!currentIssue) {
        acc.push(issue);
      }

      return acc;
    },
    [],
  );
  const keys = map(allIssues, "key");

  if (!keys.length) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { issues: fullIssues } = await baseRequest<{ issues: any }>(client, {
    url: "/search",
    method: "GET",
    queryParams: [
      `jql=${encodeURIComponent(`issueKey IN (${keys.join(",")})`)}`,
      `expand=editmeta`
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

  let epics: { [key: string]: Omit<JiraIssueDetails, "editmeta"> } = {};


  if (Object.values(epicKeys).length) {
    const epicJql = encodeURIComponent(`issueKey IN (${Object.values(epicKeys).join(",")})`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { issues: fullEpics } = await baseRequest<{ issues: any }>(client, {
      url: "/search",
      method: "GET",
      queryParams: `jql=${epicJql}`,
    });

    epics = (fullEpics ?? []).reduce(
      (list: unknown[], issue: { key: string }) => ({ ...list, [issue.key]: issue }),
      {}
    );
  }

  return (allIssues ?? []).map((issue: JiraIssueSearch) => ({
    id: get(issues, [issue.key, "id"]),
    key: get(issue, ["key"]),
    keyHtml: get(issue, ["keyHtml"]),
    summary: get(issue, ["summaryText"]),
    summaryHtml: get(issue, ["summary"]),
    status: get(issues, [issue.key, "fields", "status", "name"], "-"),
    projectKey: get(issues, [issue.key, "fields", "project", "key"], ""),
    projectName: get(issues, [issue.key, "fields", "project", "name"], "-"),
    reporterId: get(issues, [issue.key, "fields", "reporter", "accountId"], ""),
    reporterName: get(issues, [issue.key, "fields", "reporter", "displayName"], "-"),
    reporterAvatarUrl: get(issues, [issue.key, "fields", "reporter", "avatarUrls", "24x24"], ""),
    epicKey: epics[epicKeys[issue.key]] ? epics[epicKeys[issue.key]].key : undefined,
    epicName: epics[epicKeys[issue.key]] ? epics[epicKeys[issue.key]].fields.summary : undefined,
  } as IssueItem));
};
