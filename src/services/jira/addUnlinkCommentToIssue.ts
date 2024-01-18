import { baseRequest } from "./baseRequest";
import { removeBacklinkCommentDoc } from "../../utils/adf";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueItem } from "./types";

/**
 * Add "unlinked" comment to JIRA issue
 */
export const addUnlinkCommentToIssue = (
  client: IDeskproClient,
  key: IssueItem["key"],
  ticketId: string,
  url: string,
) => {
  return baseRequest(client, {
    url: `/issue/${key}/comment`,
    method: "POST",
    data: {
      body: removeBacklinkCommentDoc(ticketId, url),
    },
  })
};
