import isEmpty from "lodash/isEmpty";
import { proxyFetch } from "@deskpro/app-sdk";
import { BASE_URL, placeholders } from "../../constants";
import {
  isForm,
  getQueryParams,
  getRequestBody,
} from "../../utils";
import { JiraError } from "./JiraError";
import type { Request, FetchOptions } from "../../types";

const baseRequest: Request = async (client, {
  url,
  rawUrl,
  data,
  method = "GET",
  queryParams = {},
  headers: customHeaders,
}) => {
  const dpFetch = await proxyFetch(client);

  const baseUrl = rawUrl ? rawUrl : `${BASE_URL}/rest/api/2${url || ""}`;
  const params = getQueryParams(queryParams);
  const body = getRequestBody(data);

  const requestUrl = `${baseUrl}${isEmpty(params) ? "": `?${params}`}`;
  const options: FetchOptions = {
    method,
    body,
    headers: {
      "Authorization": `Bearer ${placeholders.API_KEY}`,
      "Accept": "application/json",
      ...customHeaders,
    },
  };

  if (!isEmpty(data)) {
    options.headers = {
      "Content-Type": "application/json",
      ...(!isForm(body) ? {} : { "X-Atlassian-Token": "no-check" }),
      ...options.headers,
    };
  }

  const res = await dpFetch(requestUrl, options);

  if (res.status < 200 || res.status > 399) {
    let errorData;

    try {
      errorData = await res.json();
    } catch (e) {
      errorData = {};
    }

    throw new JiraError({
      status: res.status,
      data: errorData,
    });
  }

  let result;

  try {
    result = await res.json();
  } catch (e) {
    return {};
  }

  return result;
};

export { baseRequest };
