import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraIssueDetails } from "./types";

/**
 * Fetch a single JIRA issue by key, e.g. "DP-1"
 */
export const getIssueByKey = (client: IDeskproClient, key: string) => {
  return baseRequest<JiraIssueDetails>(client, {
    url: `/issue/${key}`,
    queryParams: {
      expand: "editmeta,renderedFields",
    }
  });
};
