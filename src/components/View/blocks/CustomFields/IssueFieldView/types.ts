import { IssueMeta, IssueValue } from "../../../../../types";

export interface MappedViewProps {
    meta: IssueMeta;
    value: IssueValue[IssueMeta["type"]];
}
