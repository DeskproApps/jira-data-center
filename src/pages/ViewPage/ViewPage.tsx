import { useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  useSetAppTitle,
  useLoadLinkedIssues,
  useRegisterElements,
  useFindIssueComments,
  useFindLinkedIssueByKey,
  useLoadLinkedIssueAttachment,
  useFindLinkedIssueAttachmentsByKey,
} from "../../hooks";
import { useStore } from "../../context/StoreProvider/hooks";
import { View } from "../../components";
import type { FC } from "react";

const ViewPage: FC = () => {
  const navigate = useNavigate();
  const { issueKey } = useParams();
  const [state, dispatch] = useStore();
  const { client } = useDeskproAppClient();
  const loadIssueAttachments = useLoadLinkedIssueAttachment();
  const findAttachmentsByKey = useFindLinkedIssueAttachmentsByKey();
  const findByKey = useFindLinkedIssueByKey();
  const issue = useMemo(() => findByKey(issueKey as string), [issueKey, findByKey]);
  const attachments = useMemo(
    () => state.linkedIssueAttachments ? findAttachmentsByKey(issueKey as string) : [],
    [issueKey, findAttachmentsByKey, state.linkedIssueAttachments]
  );
  const comments = useFindIssueComments(issueKey as string);
  const isLoading = state.linkedIssuesResults?.loading
    || state.linkedIssueAttachments?.loading;

  const onNavigateToAddComment = useCallback(() => {
    if (issueKey) {
      navigate(`/comment/${issueKey}`);
    }
  }, [navigate, issueKey]);

  useLoadLinkedIssues();

  useSetAppTitle(issueKey || "");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    // registerElement("edit", { type: "edit_button", payload: issueKey });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Unlink Ticket",
        payload: { type: "unlink", issueKey },
      }],
    });
  }, [client, issueKey, issue]);

  useEffect(() => {
    loadIssueAttachments(issueKey as string);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueKey]);

  if (state.isUnlinkingIssue) {
    return (<></>);
  }

  if (!issue) {
    dispatch({ type: "error", error: "Issue not found" });
    return (<></>);
  }

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <View
      issue={issue}
      attachments={attachments}
      comments={comments}
      onNavigateToAddComment={onNavigateToAddComment}
    />
  );
};

export { ViewPage };
