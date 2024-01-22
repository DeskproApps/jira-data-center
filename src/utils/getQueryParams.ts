import { createSearchParams } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { isForm } from "./isForm";
import type { ParamKeyValuePair } from "react-router-dom";
import type { Dict, RequestParams } from "../types";

const getQueryParams = (data?: RequestParams["queryParams"]|RequestInit["body"]): string => {
  if (isEmpty(data) && !isForm(data)) {
    return "";
  }

  if (isString(data)) {
    return data;
  } else if (Array.isArray(data)) {
    return `${createSearchParams(data)}`
  } else if (isPlainObject(data)) {
    const parsedQueryParams = Object
      .keys(data as Dict<string>)
      .map<ParamKeyValuePair>((key) => ([key, (data as Dict<string>)[key]]));
    return `${createSearchParams(parsedQueryParams)}`;
  } else if (isForm(data)) {
    return new URLSearchParams(data as never).toString();
  }

  return "";
};

export { getQueryParams };
