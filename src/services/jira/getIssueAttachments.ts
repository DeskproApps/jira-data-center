import { get } from "lodash";
import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueAttachment } from "./types";

/**
 * Get attachments for a JIRA issue
 */
export const getIssueAttachments = async (client: IDeskproClient, key: string): Promise<IssueAttachment[]> => {
  const res = await baseRequest(client, {
    url: `/issue/${key}`,
    queryParams: {
      fields: "attachment"
    },
  });

  return (get(res, ["fields", "attachment"]) || []).map((attachment: { id: number, filename: string, size: number, content: string }) => ({
    id: attachment.id,
    filename: attachment.filename,
    sizeBytes: attachment.size,
    sizeMb: attachment.size > 0
      ? (attachment.size / 1042) / 1024
      : 0
    ,
    url: attachment.content,
  } as IssueAttachment));
}
