import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useSetAppTitle, useRegisterElements } from "../../hooks";
import { addIssueComment, getIssueComments } from "../../services/jira";
import { CreateIssueComment } from "../../components";
import type { FC } from "react";
import type { CommentFormValues } from "../../components/IssueCommentForm";

const CreateIssueCommentPage: FC = () => {
  const navigate = useNavigate();
  const { issueKey } = useParams();
  const { client } = useDeskproAppClient();

  useSetAppTitle("Add Comment");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  }, [issueKey]);

  const onSubmit = useCallback((data: CommentFormValues) => {
    if (!client || !issueKey) {
      return Promise.resolve();
    }

    return addIssueComment(client, issueKey, data.comments)
      .then(() => getIssueComments(client, issueKey))
      .then(() => navigate(`/view/${issueKey}`));
  }, [client, issueKey, navigate]);

  const onCancel = useCallback(() => {
    navigate(`/view/${issueKey}`)
  }, [navigate, issueKey]);

  return (
    <CreateIssueComment
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export { CreateIssueCommentPage };
