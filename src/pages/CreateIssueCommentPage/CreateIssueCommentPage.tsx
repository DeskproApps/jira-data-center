import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useSetAppTitle, useRegisterElements } from "../../hooks";
import { useStore } from "../../context/StoreProvider/hooks";
import { addIssueComment, getIssueComments } from "../../context/StoreProvider/api";
import { CreateIssueComment } from "../../components";
import type { FC } from "react";
import type { CommentFormValues } from "../../components/IssueCommentForm";

const CreateIssueCommentPage: FC = () => {
  const navigate = useNavigate();
  const { issueKey } = useParams();
  const { client } = useDeskproAppClient();
  const [, dispatch] = useStore();

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
      .then((comments) => dispatch({ type: "issueComments", key: issueKey, comments }))
      .then(() => navigate(`/view/${issueKey}`));
  }, [client, issueKey, dispatch, navigate]);

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

export {CreateIssueCommentPage};
