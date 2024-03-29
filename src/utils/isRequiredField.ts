import { get, find } from "lodash";
import type { JiraIssueType, JiraProject, } from "../services/jira/types";

const isRequiredField = ({ projects, fieldName, projectId, issueTypeId }: {
  projects: JiraProject[],
  fieldName: string,
  projectId: JiraProject["id"],
  issueTypeId: JiraIssueType["id"],
}): boolean => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return false;
  }

  const project = (projects).find(({ id }: JiraProject) => id === projectId);

  if (!project) {
    return false;
  }

  const issueType = find(project.issuetypes, { id: issueTypeId });

  return get(issueType, ["fields", fieldName, "required"]);
};

export { isRequiredField };
