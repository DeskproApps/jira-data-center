import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  useSetAppTitle,
  useRegisterElements,
} from "../../hooks";
import { useIssue } from "./hooks";
import { View } from "../../components";
import type { FC } from "react";

const ViewPage: FC = () => {
  const navigate = useNavigate();
  const { issueKey } = useParams();
  const { client } = useDeskproAppClient();
  const { issue, attachments, comments, isLoading } = useIssue(issueKey);

  const onNavigateToAddComment = useCallback(() => {
    if (issueKey) {
      navigate(`/comment/${issueKey}`);
    }
  }, [navigate, issueKey]);

  useSetAppTitle(issueKey || "");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    // issueKey && registerElement("edit", {
    //   type: "edit_button",
    //   payload: {
    //     type: "changePage",
    //     path: `/edit/${issueKey}`,
    //   },
    // });
    issueKey && registerElement("menu", {
      type: "menu",
      items: [{
        title: "Unlink Ticket",
        payload: { type: "unlink", issueKey },
      }],
    });
  }, [client, issueKey, issue]);

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
