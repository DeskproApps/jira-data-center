import { baseRequest } from "./baseRequest";
import { remoteLinkGlobalId } from "./utils";
import type { IDeskproClient } from "@deskpro/app-sdk";

/**
 * Add remote link
 */
export const addRemoteLink = (
  client: IDeskproClient,
  key: string,
  ticketId: string,
  subject: string,
  url: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return baseRequest<any>(client, {
    url: `/issue/${key}/remotelink`,
    method: "POST",
    data: {
      globalId: remoteLinkGlobalId(ticketId),
      object: {
        url,
        title: `Deskpro #${ticketId}`,
        summary: subject,
      },
    }
  });
};
