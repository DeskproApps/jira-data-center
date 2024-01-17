import { useMemo, useCallback } from "react";
import { get } from "lodash";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import type { Maybe, TicketContext } from "../types";
import type { IssueItem } from "../services/jira/types";

type UseExternalLink = () => {
  getBaseUrl: () => Maybe<string>,
  getIssueUrl: (issueKey: Maybe<IssueItem["key"]>) => Maybe<string>,
};

const useExternalLink: UseExternalLink = () => {
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const instanceUrl = useMemo(() => {
      return get(context, ["settings", "instance_url"]);
    }, [context]);

    const getBaseUrl = useCallback(() => {
        return !instanceUrl ? "#" : instanceUrl;
    }, [instanceUrl]);

    const getIssueUrl = useCallback((issueKey?: Maybe<IssueItem["key"]>) => {
      return (!instanceUrl || !issueKey)
        ? "#"
        : `${instanceUrl}/browse/${issueKey}`;
    }, [instanceUrl]);

    return { getBaseUrl, getIssueUrl };
};

export { useExternalLink };
