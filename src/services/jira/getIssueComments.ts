import { get, orderBy } from "lodash";
import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraComment, JiraUserInfo } from "./types";

/**
 * Get list of comments for a given issue key
 */
export const getIssueComments = async (client: IDeskproClient, key: string): Promise<JiraComment[]> => {
  const data = await baseRequest(client, {
    url: `/issue/${key}/comment`,
    queryParams: {
      expand: "renderedBody",
    },
  });

  const comments = (get(data, ["comments"], []) || []).map((comment: {
    author: JiraUserInfo,
    body: string,
    created: string,
    updated: string,
    id: string,
    jsdPublic: boolean,
    renderedBody: string,
    self: string,
    updateAuthor: JiraUserInfo,
  }) => ({
    id: comment.id,
    created: new Date(comment.created),
    updated: new Date(comment.updated),
    body: comment.body,
    renderedBody: comment.renderedBody,
    author: {
      accountId: comment.author.accountId,
      displayName: comment.author.displayName,
      avatarUrl: comment.author.avatarUrls["24x24"],
    },
  }));

  return orderBy<JiraComment>(comments, (comment) => comment.created, ['desc']);
};
