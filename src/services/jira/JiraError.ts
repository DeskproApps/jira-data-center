import type { JiraAPIError } from "./types";

export type InitData = {
  status: number,
  data?: JiraAPIError,
};

class JiraError extends Error {
  status: number;
  data?: JiraAPIError;

  constructor({ status, data }: InitData) {
    const message = "Jira Api Error";
    super(message);

    this.data = data;
    this.status = status;
  }
}

export { JiraError };
