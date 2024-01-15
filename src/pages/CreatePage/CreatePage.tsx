import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import {
  createIssue,
  addRemoteLink,
  getIssueByKey,
  InvalidRequestResponseError,
} from "../../services/jira";
import {
  useAsyncError,
  useSetAppTitle,
  useRegisterElements,
  useLoadLinkedIssues,
} from "../../hooks";
import { CreateLinkIssue} from "../../components/CreateLinkIssue/CreateLinkIssue";
import { IssueForm } from "../../components/IssueForm/IssueForm";
import {IssueFormData, JiraIssueDetails} from "../../services/jira/types";
import type { FC } from "react";
import type { FormikHelpers } from "formik";
import type { SubmitIssueFormData } from "../../components/IssueForm/types";
import type { IssueMeta } from "../../types";

const CreatePage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const { asyncErrorHandler } = useAsyncError();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

    useLoadLinkedIssues();

    useSetAppTitle("Add Issue");

    useRegisterElements(({ registerElement }) => {
      registerElement("refresh", { type: "refresh_button" });
      registerElement("home", {
        type: "home_button",
        payload: { type: "changePage", path: "/home" },
      });
    });

    const onSubmit = (
        data: SubmitIssueFormData,
        _helpers: FormikHelpers<IssueFormData>,
        meta: Record<string, IssueMeta>,
    ) => {
        if (!client || !context?.data.ticket) {
            return;
        }

        setLoading(true);
        setApiErrors({});

        createIssue(client, data, meta)
            .then(({ key }) => getIssueByKey(client, key))
            .then(async (issue: JiraIssueDetails) => {
                await client
                    .getEntityAssociation("linkedJiraDataCentreIssue", context?.data.ticket.id as string)
                    .set(issue.key, issue);

                return issue.key;
            })
            .then((key) => addRemoteLink(
                client,
                key,
                context?.data.ticket.id as string,
                context?.data.ticket.subject as string,
                context?.data.ticket.permalinkUrl as string
            ))
            .then(() => {
                setLoading(false);
                navigate("/home");
            })
            .catch((error) => {
                if (error instanceof InvalidRequestResponseError && error.response?.errors) {
                    setApiErrors(error.response.errors);
                } else {
                  asyncErrorHandler(error);
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <CreateLinkIssue selected="create" />
            <IssueForm
                type="create"
                onSubmit={onSubmit}
                loading={loading}
                apiErrors={apiErrors}
            />
        </>
    );
};

export { CreatePage };
