import { baseRequest } from "./baseRequest";
import { remoteLinkGlobalId } from "./utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueItem } from "./types";

/**
 * Remove remote link
 */
export const removeRemoteLink = (
  client: IDeskproClient,
  key: IssueItem["key"],
  ticketId: string,
) => {
  return baseRequest(client, {
    url: `/issue/${key}/remotelink?globalId=${remoteLinkGlobalId(ticketId)}`,
    method: "DELETE",
  });
};
