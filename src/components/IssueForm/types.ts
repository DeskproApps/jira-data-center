import { FormikHelpers } from "formik";
import type { IssueMeta } from "../../types";
import type { IssueFormData } from "../../services/jira/types";

export interface JiraField {
    key: string;
    name: string;
    schema: {
        type: string;
        custom: string;
        customId: number;
    };
}

export const mandatoryFields = [
    "issuetype",
    "project",
    "reporter",
    "summary",
];

export type SubmitIssueFormData = Omit<IssueFormData, "labels"|"priority"|"assigneeUserId"|"reporterUserId">
    & Partial<Pick<IssueFormData, "labels"|"priority"|"assigneeUserId"|"reporterUserId">>;

export interface IssueFormProps {
  onSubmit: (
    values: SubmitIssueFormData,
    formikHelpers: FormikHelpers<IssueFormData>,
    meta: Record<string, IssueMeta>,
  ) => void | Promise<void>;
  type: "create"|"update";
  apiErrors?: Record<string, string>;
  values?: IssueFormData;
  loading?: boolean;
  editMeta?: Record<string, IssueMeta>;
  issueKey?: string;
}
