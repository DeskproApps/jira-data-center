import { useMemo, useCallback } from "react";
import { find } from "lodash";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { getIssueDependencies } from "../../services/jira";
import {
  getUserOptions,
  getLabelOptions,
  getProjectOptions,
} from "./utils";
import { getOption } from "../../utils";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import {FieldType, IssueMeta} from "../../types";
import {IssueFormData, JiraIssueType, JiraPriorityValue, JiraProject, JiraUser} from "../../services/jira/types";
import {buildCustomFieldMeta} from "../../services/jira/utils";

type UseFormDeps = (
  values?: IssueFormData,
  editMeta?: Record<string, IssueMeta>,
) => {
  isLoading: boolean,
  projects: JiraProject[],
  extraLabels: string[],
  projectOptions: Array<DropdownValueType<JiraProject["id"]>>,
  userOptions: Array<DropdownValueType<JiraUser["key"]>>,
  labelOptions: Array<DropdownValueType<string>>,
  buildIssueTypeOptions: (projectId: JiraProject["id"]) => Array<DropdownValueType<JiraIssueType["id"]>>,
  buildPriorityOptions: (
    projectId: JiraProject["id"],
    issueTypeId: JiraPriorityValue["id"],
  ) => Array<DropdownValueType<JiraPriorityValue["id"]>>,
  getCustomFields: (
    projectId?: JiraProject["id"],
    issueTypeId?: JiraIssueType["id"],
  ) => Record<string, IssueMeta>
};

const useFormDeps: UseFormDeps = (values, editMeta) => {
  const { data, isLoading } = useQueryWithClient([QueryKey.ISSUE_DEPENDENCIES], getIssueDependencies);

  const extraLabels: string[] = useMemo(() => [], []);

  if (values && editMeta) {
    const labelFields = Object.values(editMeta).filter((meta) => meta.type === FieldType.LABELS);
    const labels = labelFields.map((meta) => values.customFields[meta.key] ?? null).filter((l) => !!l);

    labels.forEach((labels) => labels.forEach((l: string) => extraLabels.push(l)));
  }

  const buildIssueTypeOptions = useCallback((projectId: JiraProject["id"]) => {
    const { projects } =  data?.createMeta || {};
    const project = find(projects || [], { id: projectId });

    if (!project) {
      return [];
    }

    return (project.issuetypes ?? []).map((issueType: JiraIssueType) => {
      return getOption(issueType.id, issueType.name);
    });
  }, [data?.createMeta]);

  const buildPriorityOptions = useCallback((projectId: string, issueTypeId: string) => {
    const { projects } = data?.createMeta || {};
    const project = find(projects || [], { id: projectId });

    if (!project) {
      return [];
    }

    const issueType = find(project.issuetypes, { id: issueTypeId });

    return (issueType?.fields?.priority?.allowedValues ?? [])
      .map((priority: JiraPriorityValue) => getOption(priority.id, priority.name));
  }, [data?.createMeta]);

  const getCustomFields = (projectId?: string, issueTypeId?: string): Record<string, IssueMeta> => {
    const { projects } = data?.createMeta || {};

    const project = find(projects || [], { id: projectId });

    if (!project) {
      return {};
    }

    const issueType = find(project.issuetypes || [], { id: issueTypeId });

    if (!issueType) {
      return {};
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return buildCustomFieldMeta(issueType.fields);
  };

  return {
    isLoading: isLoading,
    projects: data?.projects || [],
    projectOptions: useMemo(() => getProjectOptions(data?.projects), [data?.projects]),
    userOptions: useMemo(() => getUserOptions(data?.users), [data?.users]),
    labelOptions: useMemo(() => {
      return getLabelOptions([...(data?.labels || []), ...extraLabels]);
    }, [data?.labels, extraLabels]),
    extraLabels,
    buildIssueTypeOptions,
    buildPriorityOptions,
    getCustomFields,
  };
};

export { useFormDeps };
