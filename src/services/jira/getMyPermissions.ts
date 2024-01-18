import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Permissions } from "./types";

/**
 * Get the status of all required Jira permissions
 */
export const getMyPermissions = (client: IDeskproClient) => {
  const required = [
    "BROWSE_PROJECTS",
    "CREATE_ISSUES",
    "EDIT_ISSUES",
    "ASSIGN_ISSUES",
    "ADD_COMMENTS",
    "MANAGE_WATCHERS",
  ];

  return baseRequest<{ permissions: Permissions }>(client, {
    url: `/mypermissions`,
    queryParams: {
      permissions: required.join(","),
    },
  });
};
