import { useMemo, useState, useCallback } from "react";
import { get, noop } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityService } from "../services/deskpro";
import { removeRemoteLink } from "../services/jira";
import { useAsyncError } from "./useAsyncError";
import { useReplyBox } from "./useReplyBox";
import type { IssueItem } from "../services/jira/types";

export type Result = {
  isLoading: boolean,
  unlink: (issueKey: IssueItem["key"]) => void,
};

const useUnlinkIssue = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { asyncErrorHandler } = useAsyncError();
  const { deleteSelectionState } = useReplyBox();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const unlink = useCallback((issueKey: IssueItem["key"]) => {
    if (!client || !ticketId || !issueKey) {
      return;
    }

    setIsLoading(true);

    removeRemoteLink(client, issueKey, ticketId)
      .catch(noop)
      .then(() => Promise.all([
        deleteEntityService(client, ticketId, issueKey),
        deleteSelectionState(issueKey, "note"),
        deleteSelectionState(issueKey, "email"),
      ]))
      .then(() => navigate("/home"))
      .catch(asyncErrorHandler)
      .finally(() => setIsLoading(false));
  }, [client, navigate, ticketId, asyncErrorHandler, deleteSelectionState]);

  return { isLoading, unlink };
};

export { useUnlinkIssue };
