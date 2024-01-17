import { useMemo, useState } from "react";
import { get } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import {
  updateIssue,
  InvalidRequestResponseError,
} from "../../services/jira";
import { useIssueDeps } from "./hooks";
import {
  useAsyncError,
  useSetAppTitle,
  useRegisterElements,
} from "../../hooks";
import { IssueForm } from "../../components/IssueForm/IssueForm";
import type { FormikHelpers } from "formik";
import type { FC } from "react";
import type { IssueMeta } from "../../types";
import type { IssueFormData } from "../../services/jira/types";
import type { SubmitIssueFormData } from "../../components/IssueForm/types";

const EditPage: FC = () => {
    const navigate = useNavigate();
    const { issueKey } = useParams();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<Record<string, string>|undefined>({});
    const { isLoading, values, editMeta, issue } = useIssueDeps(issueKey);
    const { asyncErrorHandler } = useAsyncError();
    const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

    useSetAppTitle(`Edit ${issueKey}`);

    useRegisterElements(({ registerElement }) => {
      registerElement("refresh", { type: "refresh_button" });
      registerElement("home", {
        type: "home_button",
        payload: { type: "changePage", path: "/home" },
      });
    }, [client, issueKey]);

    const onSubmit = (
        data: SubmitIssueFormData,
        _helpers: FormikHelpers<IssueFormData>,
        meta: Record<string, IssueMeta>,
    ) => {
        if (!client || !ticketId || !issueKey) {
            return;
        }

        setLoading(true);
        setApiErrors({});

        updateIssue(client, issueKey, data, meta)
            .then(() => setEntityService(client, ticketId, issueKey, issue))
            .then(() => navigate(`/view/${issueKey}`))
            .catch((error) => {
                if (error instanceof InvalidRequestResponseError && (error.response?.errors || error.response?.errorMessages)) {
                    setApiErrors(error.response.errors ?? error.response?.errorMessages);
                } else {
                  asyncErrorHandler(error);
                }
            })
            .finally(() => setLoading(false));
    };

    if (isLoading) {
        return (
          <LoadingSpinner />
        );
    }

    return (
        <IssueForm
            type="update"
            onSubmit={onSubmit}
            loading={loading}
            apiErrors={apiErrors}
            values={values}
            editMeta={editMeta}
            issueKey={issueKey}
        />
    );
};

export { EditPage };
