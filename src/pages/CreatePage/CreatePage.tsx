import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { addRemoteLink, createIssue, getIssueByKey } from "../../context/StoreProvider/api";
import {
  useSetAppTitle,
  useRegisterElements,
  useLoadLinkedIssues,
} from "../../hooks";
import { useStore } from "../../context/StoreProvider/hooks";
import { CreateLinkIssue} from "../../components/CreateLinkIssue/CreateLinkIssue";
import { IssueForm } from "../../components/IssueForm/IssueForm";
import { IssueFormData, InvalidRequestResponseError } from "../../context/StoreProvider/types";
import type { FC } from "react";
import type { FormikHelpers } from "formik";
import type { SubmitIssueFormData } from "../../components/IssueForm/types";
import type { IssueMeta } from "../../types";

const CreatePage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const [ state, dispatch ] = useStore();
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
        if (!client || !state.context?.data.ticket) {
            return;
        }

        setLoading(true);
        setApiErrors({});

        createIssue(client, data, meta)
            .then(({ key }) => getIssueByKey(client, key))
            .then(async (issue) => {
                await client
                    .getEntityAssociation("linkedJiraDataCentreIssue", state.context?.data.ticket.id as string)
                    .set(issue.key, issue)
                ;

                return issue.key;
            })
            .then((key) => addRemoteLink(
                client,
                key,
                state.context?.data.ticket.id as string,
                state.context?.data.ticket.subject as string,
                state.context?.data.ticket.permalinkUrl as string
            ))
            .then(() => {
                setLoading(false);
                navigate("/home");
            })
            .catch((error) => {
                if (error instanceof InvalidRequestResponseError && error.response?.errors) {
                    setApiErrors(error.response.errors);
                } else {
                    dispatch({ type: "error", error });
                }
            })
            .finally(() => {
                setLoading(false);
            })
        ;
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
