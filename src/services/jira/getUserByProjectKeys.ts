import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraUserInfo, JiraProject } from "./types";

const getUserByProjectKeys = (
  client: IDeskproClient,
  projectKeys: Array<JiraProject["key"]>,
) => {
  return baseRequest<JiraUserInfo[]>(client, {
    url: `/user/assignable/multiProjectSearch?projectKeys=${projectKeys.join(",")}`,
  });
};

export { getUserByProjectKeys };
