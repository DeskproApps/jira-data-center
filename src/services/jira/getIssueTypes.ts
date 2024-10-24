import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraProject, JiraIssueType } from "./types";

const getIssueTypes = (
  client: IDeskproClient,
  projectId: JiraProject["id"],
) => {
  return baseRequest<{ values?: JiraIssueType[] }>(client, {
    url: `/issue/createmeta/${projectId}/issuetypes?maxResults=999`,
  })
};

export { getIssueTypes };
