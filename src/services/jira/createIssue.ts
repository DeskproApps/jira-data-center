import { get } from "lodash";
import { baseRequest } from "./baseRequest";
import { paragraphDoc } from "../../utils/adf";
import { formatCustomFieldValue } from "./utils";
import { InvalidRequestResponseError } from "./InvalidRequestResponseError";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueMeta } from "../../types";
import type { SubmitIssueFormData } from "../../components/IssueForm/types";
import type { AttachmentFile, JiraIssueDetails } from "./types";

export const createIssue = async (
  client: IDeskproClient,
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

  const res = await baseRequest<JiraIssueDetails>(client, {
    url: `/issue`,
    method: "POST",
    data: body,
  });

  const issueId = get(res, ["id"]);
  const issueKey = get(res, ["key"]);

  if (!issueId || !issueKey) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new InvalidRequestResponseError("Failed to create JIRA issue", res as any);
  }

  if ((data.attachments ?? []).length) {
    const attachmentUploads = data.attachments.map((attachment: AttachmentFile) => {
      if (attachment.file) {
        const form = new FormData();
        form.append(`file`, attachment.file);

        return baseRequest(client, {
          url: `/issue/${issueKey}/attachments`,
          method: "POST",
          data: form,
        });
      }
    });

    await Promise.all(attachmentUploads);
  }

  return res;
};
