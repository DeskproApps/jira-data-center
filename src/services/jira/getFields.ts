import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraProject, JiraIssueType, JiraFieldMeta } from "./types";

const getFields = (
  client: IDeskproClient,
  projectId: JiraProject["id"],
  issueTypeId: JiraIssueType["id"],
) => {
  return baseRequest<{ values: JiraFieldMeta[] }>(client, {
    url: `/issue/createmeta/${projectId}/issuetypes/${issueTypeId}?maxResults=999`,
  })
};

export { getFields };
