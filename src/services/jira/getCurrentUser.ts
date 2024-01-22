import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";

const getCurrentUser = (client: IDeskproClient) => {
  return baseRequest(client, { url: "/myself" });
};

export { getCurrentUser };
