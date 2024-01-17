import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueItem, JiraIssueDetails } from "./types";

/**
 * Fetch a single JIRA issue by key, e.g. "DP-1"
 */
export const getIssueByKey = (client: IDeskproClient, key: IssueItem["key"]) => {
  return baseRequest<JiraIssueDetails>(client, {
    url: `/issue/${key}`,
    queryParams: {
      expand: "editmeta,renderedFields",
    }
  });
};
