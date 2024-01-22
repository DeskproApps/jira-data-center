import { baseRequest } from "./baseRequest";
import { paragraphDoc } from "../../utils/adf";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueItem } from "./types";

/**
 * Add a comment to an issue
 */
export const addIssueComment = (
  client: IDeskproClient,
  key: IssueItem["key"],
  comment: string,
) => {
  return baseRequest(client, {
    url: `/issue/${key}/comment`,
    method: "POST",
    data: {
      body: paragraphDoc(comment),
    },
  });
};
