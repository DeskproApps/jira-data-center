import { useMemo } from "react";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import {
  getFields,
  getLabels,
  getProjects,
  getIssueTypes,
  getUserByProjectKeys,
} from "../../services/jira";
import { buildCustomFieldMeta } from "../../services/jira/utils";
import {
  getUserOptions,
  getLabelOptions,
  getProjectOptions,
} from "./utils";
import { getOption } from "../../utils";
import { FieldType } from "../../types";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { IssueMeta } from "../../types";
import {
  JiraUser,
  JiraProject,
  JiraUserInfo,
  IssueFormData,
  JiraIssueType,
  JiraPriorityValue,
} from "../../services/jira/types";

type UseFormDeps = (
  values?: IssueFormData,
  editMeta?: Record<string, IssueMeta>,
) => {
  isLoading: boolean,
  projects: JiraProject[],
  labels: string[],
  extraLabels: string[],
  projectOptions: Array<DropdownValueType<JiraProject["id"]>>,
  users: JiraUserInfo[],
  userOptions: Array<DropdownValueType<JiraUser["key"]>>,
  labelOptions: Array<DropdownValueType<string>>,
  issueTypeOptions: Array<DropdownValueType<JiraIssueType["id"]>>,
  priorityOptions: Array<DropdownValueType<JiraPriorityValue["id"]>>,
  customFields: Record<string, IssueMeta>,
};

const useFormDeps: UseFormDeps = (values, editMeta) => {
  const projectId = values?.projectId;
  const issueTypeId = values?.issueTypeId;

  const projects = useQueryWithClient([QueryKey.PROJECTS], getProjects);

  const issueTypes = useQueryWithClient(
    [QueryKey.ISSUE_TYPES, projectId as JiraProject["id"]],
    (client) => getIssueTypes(client, projectId as JiraProject["id"]),
    { enabled: Boolean(projectId) },
  );

  const fields = useQueryWithClient(
    [QueryKey.ISSUE_FIELDS, projectId as string, issueTypeId as string],
    (client) => getFields(client, projectId as JiraProject["id"], issueTypeId as JiraIssueType["id"]),
    { enabled: Boolean(projectId) && Boolean(issueTypeId) },
  );

  const projectKey = projects.data?.find(({ id }) => projectId && id === projectId)?.key;

  const users = useQueryWithClient(
    [QueryKey.USERS, projectKey as JiraProject["key"]],
    (client) => getUserByProjectKeys(client, [projectKey as JiraProject["key"]]),
    { enabled: Boolean(projectKey) },
  );

  const userOptions = useMemo(() => getUserOptions(users.data), [users.data]);

  const labels = useQueryWithClient([QueryKey.LABELS], getLabels);

  const extraLabels: string[] = useMemo(() => [], []);

  if (values && editMeta) {
    const labelFields = Object.values(editMeta).filter((meta) => meta.type === FieldType.LABELS);
    const labels = labelFields.map((meta) => values.customFields[meta.key] ?? null).filter((l) => !!l);

    labels.forEach((labels) => labels.forEach((l: string) => extraLabels.push(l)));
  }

  const labelOptions = useMemo(() => {
    return getLabelOptions([
      ...(labels.data?.results.map(({ displayName }) => displayName).filter(Boolean) || []),
      ...extraLabels,
    ]);
  }, [labels.data?.results, extraLabels]);

  const projectOptions = useMemo(() => getProjectOptions(projects.data), [projects.data]);

  const issueTypeOptions = useMemo(() => {
    return (issueTypes.data?.values ?? []).map((issueType: JiraIssueType) => {
      return getOption(issueType.id, issueType.name);
    });
  }, [issueTypes.data?.values]);

  const customFields = useMemo(() => {
    const map = (fields.data?.values ?? []).reduce((acc, f) => ({ ...acc, [f.fieldId]: f }), {});
    return buildCustomFieldMeta(map);
  }, [fields.data?.values]);

  const priorityOptions = useMemo(() => {
    const priorityField = fields.data?.values?.find((f) => f.fieldId === "priority");

    return (priorityField?.allowedValues ?? [])
      .map((priority) => getOption(priority.id, priority.name));
  }, [fields.data?.values]);

  return {
    isLoading: [projects, labels].some(({ isLoading }) => isLoading),
    projects: projects.data ?? [],
    projectOptions,
    userOptions,
    labelOptions,
    extraLabels,
    issueTypeOptions,
    priorityOptions,
    customFields,
    labels: (labels.data?.results?? []).map((label) => label.displayName).filter(Boolean),
    users: users.data ?? [],
  };
};

export { useFormDeps };
