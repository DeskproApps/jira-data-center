import { baseRequest } from "./baseRequest";
import { backlinkCommentDoc } from "../../utils/adf";
import type { IDeskproClient } from "@deskpro/app-sdk";

/**
 * Add "linked" comment to JIRA issue
 */
export const addLinkCommentToIssue = async (
  client: IDeskproClient,
  key: string,
  ticketId: string,
  url: string,
) => {
  return baseRequest(client, {
    data: {
      url: `/issue/${key}/comment`,
      method: "POST",
      data: {
        body: backlinkCommentDoc(ticketId, url),
      },
    },
  });
};
