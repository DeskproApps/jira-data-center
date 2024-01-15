import type { JiraAPIError } from "./types";

export class InvalidRequestResponseError extends Error {
  constructor(message: string, private _response: JiraAPIError) {
    super(message);
  }

  get response() {
    return this._response;
  }
}
