import { get, isEmpty } from "lodash";
import { JiraError } from "../services/jira";
import { DEFAULT_ERROR } from "../constants";

const getApiError = (
  error?: Error|JiraError,
): (string|string[]|Record<string, string>) => {
  const err1 = get(error, ["data", "errors"])
  const err2 = get(error, ["data", "errorMessages", 0]);
  const err3 = get(error, ["data", "message"]);

  let message = DEFAULT_ERROR;

  if (!isEmpty(err1)) {
    message = err1;
  } else if (!isEmpty(err2)) {
    message = err2;
  } else if (!isEmpty(err3)) {
    message = err3;
  }

  return message;
};

export { getApiError };
