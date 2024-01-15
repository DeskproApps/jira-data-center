import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";

/**
 * Get an issue's remote links
 */
export const getRemoteLinks = async (client: IDeskproClient, key: string) => {
  return baseRequest(client, {
    url: `/issue/${key}/remotelink`,
  });
};
