import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import {
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getEntityListService } from "../services/deskpro";
import { listLinkedIssues } from "../services/jira";
import { QueryKey } from "../query";
import type { IssueItem } from "../services/jira/types";

export type Result = {
  isLoading: boolean,
  issues: IssueItem[],
};

type UseLinkedIssues = () => Result;

const useLinkedIssues: UseLinkedIssues = () => {
  const { context } = useDeskproLatestAppContext();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_ISSUES, ticketId],
    (client) => getEntityListService(client, ticketId),
    { enabled: Boolean(ticketId) },
  );

  const issues = useQueryWithClient(
    [QueryKey.ISSUES, ...(linkedIds.data || [])],
    (client) => listLinkedIssues(client, linkedIds.data || []),
    { enabled: size(linkedIds.data || []) > 0 },
  );

  return {
    isLoading: [linkedIds, issues].some(({ isLoading }) => isLoading),
    issues: issues.data || [],
  };
};

export { useLinkedIssues };
