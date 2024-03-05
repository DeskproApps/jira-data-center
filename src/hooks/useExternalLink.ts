import { useMemo, useCallback } from "react";
import { get } from "lodash";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import type { Maybe, TicketContext } from "../types";
import type { IssueItem, JiraUser } from "../services/jira/types";

type UseExternalLink = () => {
  getBaseUrl: () => Maybe<string>,
  getIssueUrl: (issueKey: Maybe<IssueItem["key"]>) => Maybe<string>,
  getUserUrl: (username: Maybe<JiraUser["name"]>) => Maybe<string>,
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

    const getUserUrl = useCallback((username?: Maybe<JiraUser["name"]>) => {
      return (!instanceUrl || !username)
        ? "#"
        : `${instanceUrl}/secure/ViewProfile.jspa?name=${username}`;
    }, [instanceUrl]);

    return { getBaseUrl, getIssueUrl, getUserUrl };
};

export { useExternalLink };
