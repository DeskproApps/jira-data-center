import { IssueFormData } from "../../services/jira/types";

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
