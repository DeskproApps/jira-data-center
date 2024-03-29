import { has } from "lodash";
import { baseRequest } from "./baseRequest";
import { paragraphDoc } from "../../utils/adf";
import { formatCustomFieldValue } from "./utils";
import { InvalidRequestResponseError } from "./InvalidRequestResponseError";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { SubmitIssueFormData } from "../../components/IssueForm/types";
import type { IssueMeta } from "../../types";
import type { IssueItem, JiraAPIError } from "./types";

export const updateIssue = async (
  client: IDeskproClient,
  issueKey: IssueItem["key"],
  data: SubmitIssueFormData,
  meta: Record<string, IssueMeta>,
) => {
  const customFields = Object.keys(data.customFields).reduce((fields, key) => {
    const value = formatCustomFieldValue(meta[key], data.customFields[key]);

    if (value === undefined) {
      return fields;
    }

    return {
      ...fields,
      [key]: value,
    };
  }, {});

  const body = {
    fields: {
      summary: data.summary,
      issuetype: {
        id: data.issueTypeId,
      },
      project: {
        id: data.projectId,
      },
      description: paragraphDoc(data.description),
      ...(!data.labels ? {} : { labels: data.labels }),
      ...(!data.priority ? {} : { priority: { id: data.priority } }),
      ...(!data.assigneeUserId ? {} : { assignee: { name: data.assigneeUserId } }),
      ...(!data.reporterUserId ? {} : { reporter: { name: data.reporterUserId } }),
      ...(!data.parentKey ? {} : { parent: { key: data.parentKey } }),
      ...customFields,
    },
  };

  const res = await baseRequest(client, {
    url:  `/issue/${issueKey}`,
    method: "PUT",
    data: body,
  });

  if (has(res, ["errors"]) || has(res, ["errorMessages"])) {
    throw new InvalidRequestResponseError("Failed to update JIRA issue", res as JiraAPIError);
  }

  return res;
};
