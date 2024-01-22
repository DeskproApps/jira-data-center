import { isString, isPlainObject } from "lodash";
import { isForm } from "./isForm";
import type { RequestParams } from "../types";

const getRequestBody = (data: RequestParams["data"]) => {
  if (isString(data)) {
    return data;
  }

  if (isForm(data)) {
    return data;
  }

  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }

  return;
};

export { getRequestBody };
