import { useMemo, useState, useCallback } from "react";
import { get } from "lodash";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import {
  JiraError,
  createIssue,
  addRemoteLink,
  getIssueByKey,
} from "../../services/jira";
import {
  useReplyBox,
  useAsyncError,
  useSetAppTitle,
  useRegisterElements,
} from "../../hooks";
import { getApiError } from "../../utils";
import { CreateIssue } from "../../components";
import type { IssueFormData, JiraIssueDetails } from "../../services/jira/types";
import type { FC } from "react";
import type { FormikHelpers } from "formik";
import type { SubmitIssueFormData } from "../../components/IssueForm/types";
import type { IssueMeta } from "../../types";

const CreatePage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const { asyncErrorHandler } = useAsyncError();
    const { setSelectionState } = useReplyBox();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
    const ticket = useMemo(() => get(context, ["data", "ticket"]), [context]);

    const onNavigateToLink = useCallback(() => navigate("/link"), [navigate]);

    useSetAppTitle("Add Issue");

    useRegisterElements(({ registerElement }) => {
      registerElement("refresh", { type: "refresh_button" });
      registerElement("home", {
        type: "home_button",
        payload: { type: "changePage", path: "/home" },
      });
    });

    const onSubmit = useCallback((
        data: SubmitIssueFormData,
        _helpers: FormikHelpers<IssueFormData>,
        meta: Record<string, IssueMeta>,
    ) => {
        if (!client || !ticket) {
            return;
        }

        setLoading(true);
        setApiErrors({});

        createIssue(client, data, meta)
            .then(({ key }) => getIssueByKey(client, key))
            .then(async (issue: JiraIssueDetails) => {
                await setEntityService(client, ticket.id, issue.key, issue);
                return Promise.all([
                  addRemoteLink(client, issue.key, ticket.id, ticket.subject, ticket.permalinkUrl),
                  setSelectionState(issue.key, true, "email"),
                  setSelectionState(issue.key, true, "note"),
                ]);
            })
            .then(() => navigate("/home"))
            .catch((error) => {
              if (error instanceof JiraError) {
                setApiErrors(getApiError(error) as Record<string, string>);
              } else {
                asyncErrorHandler(error);
              }
            })
            .finally(() => setLoading(false));
    }, [client, ticket, navigate, asyncErrorHandler, setSelectionState]);

    return (
      <CreateIssue
        loading={loading}
        apiErrors={apiErrors}
        onSubmit={onSubmit}
        onNavigateToLink={onNavigateToLink}
      />
    );
};

export { CreatePage };
