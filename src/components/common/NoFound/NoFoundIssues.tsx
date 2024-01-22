import size from "lodash/size";
import { NoFound } from "./NoFound";
import type { FC, ReactNode } from "react";
import type { IssueItem } from "../../../services/jira/types";

export type Props = {
  issues?: IssueItem[],
  children?: (issues: IssueItem[]) => ReactNode,
}

const NoFoundIssues: FC<Props> = ({ children, issues }) => (
  <>
    {!Array.isArray(issues)
      ? <NoFound/>
      : !size(issues)
      ? <NoFound text="No Jira issues found"/>
      : children && children(issues)
    }
  </>
);

export { NoFoundIssues };
