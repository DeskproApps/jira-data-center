import cache from "js-cache";
import { get } from "lodash";
import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraFieldMeta, JiraIssueType } from "./types";

// Key for search dependency caching (milliseconds)
const SEARCH_DEPS_CACHE_TTL = 5 * (60 * 1000); // 5 Minutes

export const getIssueDependencies = async (client: IDeskproClient) => {
  const cache_key = "data_deps";

  if (!cache.get(cache_key)) {
    const projects = await baseRequest(client, { url: `/project` });
    const createMeta = {
      projects: await Promise.all((Array.isArray(projects) ? projects : []).map(async (project) => ({
        ...project,
        issuetypes: await baseRequest(client, { url: `/issue/createmeta/${project.id}/issuetypes?maxResults=999` })
          .then(async (data) => await Promise.all((get(data, ["values"], []) || []).map(async (issueType: JiraIssueType) => ({
            ...issueType,
            fields: await baseRequest(client, { url: `/issue/createmeta/${project.id}/issuetypes/${issueType.id}?maxResults=999` })
              .then((data) => (get(data, ["values"], []) || []).reduce((acc: Record<JiraFieldMeta["fieldId"], JiraFieldMeta>, field: JiraFieldMeta) => {
                acc[field.fieldId] = field;
                return acc;
              }, {})),
          })))),
      }))),
    };
    const users = (!Array.isArray(projects) || !projects.length)
      ? await Promise.resolve([])
      : await baseRequest(client, { url: `/user/assignable/multiProjectSearch?projectKeys=${projects.map((p) => p.key).join(",")}` });
    const labels = await baseRequest(client, { url: `/jql/autocompletedata/suggestions?fieldName=labels` });

    const resolved = {
      createMeta,
      projects: projects ?? [],
      users,
      labels: (get(labels, ["results"]) || []).map((label: never) => get(label, ["displayName"])).filter(Boolean),
    };

    cache.set(cache_key, resolved, SEARCH_DEPS_CACHE_TTL);
  }

  return cache.get(cache_key);
};
