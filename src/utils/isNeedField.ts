import get from "lodash/get";
import has from "lodash/has";
import type { State } from "../context/StoreProvider/types";
import type { JiraIssueType, JiraProject } from "../services/jira/types";

const isNeedField = ({ state, fieldName, projectId, issueTypeId }: {
  state: State,
  fieldName: string,
  projectId: JiraProject["id"],
  issueTypeId: JiraIssueType["id"],
}): boolean => {
  const projects = get(state, ["dataDependencies", "createMeta", "projects"], null);

  if (!Array.isArray(projects) || projects.length === 0) {
    return false;
  }

  const project = (projects).find(({ id }: JiraProject) => id === projectId);

  if (!project) {
    return false;
  }

  const issueType = project.issuetypes.find(({ id }: JiraIssueType) => id === issueTypeId);

  return has(issueType, ["fields", fieldName]);
};

export { isNeedField };
