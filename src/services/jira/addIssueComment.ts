import { baseRequest } from "./baseRequest";
import { paragraphDoc } from "../../utils/adf";
import type { IDeskproClient } from "@deskpro/app-sdk";

/**
 * Add a comment to an issue
 */
export const addIssueComment = async (client: IDeskproClient, key: string, comment: string) => {
  return baseRequest(client, {
    url: `/issue/${key}/comment`,
    method: "POST",
    data: {
      body: paragraphDoc(comment),
    },
  });
};
