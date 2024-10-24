import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraProject } from "./types";

const getProjects = (client: IDeskproClient) => {
  return baseRequest<JiraProject[]>(client, { url: `/project` })
};

export { getProjects };
