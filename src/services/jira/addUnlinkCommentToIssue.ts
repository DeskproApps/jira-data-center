import { baseRequest } from "./baseRequest";
import { removeBacklinkCommentDoc } from "../../utils/adf";
import type { IDeskproClient } from "@deskpro/app-sdk";

/**
 * Add "unlinked" comment to JIRA issue
 */
export const addUnlinkCommentToIssue = async (client: IDeskproClient, key: string, ticketId: string, url: string) => {
  return baseRequest(client, {
    url: `/issue/${key}/comment`,
    method: "POST",
    data: {
      body: removeBacklinkCommentDoc(ticketId, url),
    },
  })
};
