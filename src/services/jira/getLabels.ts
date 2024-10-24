import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraIssueLabel } from "./types";

const getLabels = (client: IDeskproClient) => {
  return baseRequest<{ results: JiraIssueLabel[] }>(client, {
    url: `/jql/autocompletedata/suggestions?fieldName=labels`,
  });
};

export { getLabels };
