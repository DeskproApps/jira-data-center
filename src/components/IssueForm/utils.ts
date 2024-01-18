import * as Yup from "yup";
import { get, size, uniq, orderBy, toLower } from "lodash";
import { getOption } from "../../utils";
import type { Maybe, TicketContext } from "../../types";
import type { IssueFormData, JiraProject, JiraUserInfo } from "../../services/jira/types";


const schema = Yup.object().shape({
  projectId: Yup.string().required(),
  issueTypeId: Yup.string().required(),
  summary: Yup.string().min(1).max(255).required(),
  description: Yup.string().min(1).max(100000).required(),
  reporterUserId: Yup.string().required(),
});

const getInitValues = (values?: IssueFormData, context?: Maybe<TicketContext>) => {
  const initialSummary = context?.settings?.ticket_subject_as_issue_summary
    ? `[Ticket #${context?.data?.ticket.id}] ${context?.data?.ticket.subject}`
    : "";

  return values ?? {
    summary: initialSummary,
    description: "",
    issueTypeId: "",
    projectId: "",
    reporterUserId: "",
    assigneeUserId: "",
    labels: [],
    priority: "",
    customFields: {},
    attachments: [],
    parentKey: "",
  } as IssueFormData;
};

const getProjectOptions = (projects?: Maybe<JiraProject[]>) => {
  if (!Array.isArray(projects) || !size(projects)) {
    return [];
  }

  const orderedProjects = orderBy(projects || [], (t) => toLower(t.name), ['asc']);

  return orderedProjects.map((project) => getOption(project.id, `${project.name} (${project.key})`));
};

const getUserOptions = (users?: Maybe<JiraUserInfo[]>) => {
  if (!Array.isArray(users) || !size(users)) {
    return [];
  }

  const orderedUsers = orderBy(users || [], (u) => u.displayName, ['asc']);

  return orderedUsers
    .filter((u) => u.active)
    .map((user) => getOption(get(user, ["name"]), get(user, ["displayName"])));
};

const getLabelOptions = (labels?: Maybe<string[]>) => {
  if (!Array.isArray(labels) || !size(labels)) {
    return [];
  }

  return uniq(labels).map((label) => getOption(label, label));
};

export {
  schema,
  getInitValues,
  getUserOptions,
  getLabelOptions,
  getProjectOptions,
};
