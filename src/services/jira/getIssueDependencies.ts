import { get } from "lodash";
import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraFieldMeta, JiraIssueType, IssueDeps } from "./types";

export const getIssueDependencies = async (client: IDeskproClient): Promise<IssueDeps> => {
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
    : await baseRequest(client, {
      url: `/user/assignable/multiProjectSearch`,
      queryParams: [
        `projectKeys=${projects.map((p) => p.key).join(",")}`
      ].join("&"),
    });

  const labels = await baseRequest(client, { url: `/jql/autocompletedata/suggestions?fieldName=labels` });

  return {
    createMeta,
    projects: projects ?? [],
    users,
    labels: (get(labels, ["results"]) || []).map((label: never) => get(label, ["displayName"])).filter(Boolean),
  } as IssueDeps;
};
