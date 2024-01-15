import { useQueryWithClient } from "@deskpro/app-sdk";
import { searchIssues } from "../services/jira";
import { QueryKey } from "../query";
import type { IssueItem } from "../services/jira/types";

export type Result = {
  isLoading: boolean,
  issues: IssueItem[],
};

type UseSearch = (q: string) => Result;

const useSearch: UseSearch = (q: string) => {
  const issues = useQueryWithClient(
    [QueryKey.ISSUES, q as string],
    (client) => searchIssues(client, q, { withSubtask: true }),
    { enabled: Boolean(q) },
  );

  return {
    isLoading: [issues].some(({ isLoading }) => isLoading) && Boolean(q),
    issues: (issues.data || []) as IssueItem[],
  };
};

export { useSearch };
