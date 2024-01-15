import { baseRequest } from "./baseRequest";
import { remoteLinkGlobalId } from "./utils";
import type { IDeskproClient } from "@deskpro/app-sdk";

/**
 * Remove remote link
 */
export const removeRemoteLink = async (
  client: IDeskproClient,
  key: string,
  ticketId: string,
) => {
  return baseRequest(client, {
    url: `/issue/${key}/remotelink?globalId=${remoteLinkGlobalId(ticketId)}`,
    method: "DELETE",
  });
};
