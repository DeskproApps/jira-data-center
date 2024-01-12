import { isEmpty, isString } from "lodash";
import { isForm } from "./isForm";
import type { RequestParams } from "../types";

const getRequestBody = (data: RequestParams["data"]) => {
  if (isEmpty(data) || !data) {
    return;
  }

  if (isString(data)) {
    return data;
  }

  if (isForm(data)) {
    return data;
  }

  return JSON.stringify(data);
};

export { getRequestBody };
