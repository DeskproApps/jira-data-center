import { useEffect, useMemo, useState } from "react";
import get from "lodash/get";
import { useParams, useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { IssueForm } from "../../components/IssueForm/IssueForm";
import { updateIssue, getIssueByKey, InvalidRequestResponseError } from "../../services/jira";
import { formatCustomFieldValueForSet } from "../../services/jira/utils";
import { buildCustomFieldMeta } from "../../services/jira/utils";
import {
    useAdfToPlainText,
    useFindLinkedIssueAttachmentsByKey,
    useLoadLinkedIssueAttachment,
    useLoadLinkedIssues,
    useSetAppTitle,
    useRegisterElements,
} from "../../hooks";
import { useStore } from "../../context/StoreProvider/hooks";
import type { FormikHelpers } from "formik";
import type { FC } from "react";
import type { IssueMeta } from "../../types";
import type {
    IssueFormData,
    AttachmentFile,
    JiraIssueDetails,
} from "../../services/jira/types";
import type { SubmitIssueFormData } from "../../components/IssueForm/types";

const EditPage: FC = () => {
    const navigate = useNavigate();
    const { issueKey } = useParams();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const [ state, dispatch ] = useStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<Record<string, string>|undefined>({});
    const [issue, setIssue] = useState<null|JiraIssueDetails>(null);

    const adfToPlainText = useAdfToPlainText();

    useLoadLinkedIssues();
    const loadIssueAttachments = useLoadLinkedIssueAttachment();
    const findAttachmentsByKey = useFindLinkedIssueAttachmentsByKey();

    useSetAppTitle(`Edit ${issueKey}`);

    useRegisterElements(({ registerElement }) => {
      registerElement("refresh", { type: "refresh_button" });
      registerElement("home", {
        type: "home_button",
        payload: { type: "changePage", path: "/home" },
      });
    }, [client, issueKey]);

    useEffect(() => {
        (client && issueKey) && getIssueByKey(client, issueKey).then(setIssue);
    }, [client, issueKey, state.linkedIssuesResults?.list])

    useEffect(() => {
        loadIssueAttachments(issueKey as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issueKey]);

    const attachments = useMemo(
        () => findAttachmentsByKey(issueKey as string),
        [issueKey, findAttachmentsByKey]
    );

    if (!issue) {
        return (<LoadingSpinner />);
    }

    const onSubmit = (
        data: SubmitIssueFormData,
        _helpers: FormikHelpers<IssueFormData>,
        meta: Record<string, IssueMeta>,
    ) => {
        if (!client || !context?.data.ticket || !issueKey) {
            return;
        }

        setLoading(true);
        setApiErrors({});

        updateIssue(client, issueKey, data, meta)
            .then(async () => {
                const issue = await getIssueByKey(client, issueKey);

                return client
                    .getEntityAssociation("linkedJiraDataCentreIssue", context?.data.ticket.id as string)
                    .set(issueKey, issue)
                ;
            })
            .then(() => {
                setLoading(false);
                navigate(`/view/${issueKey}`);
            })
            .catch((error) => {
                if (error instanceof InvalidRequestResponseError && (error.response?.errors || error.response?.errorMessages)) {
                    setApiErrors(error.response.errors ?? error.response?.errorMessages);
                } else {
                    dispatch({ type: "error", error });
                }
            })
            .finally(() => {
                setLoading(false);
            })
        ;
    };

    const editMeta: Record<string, IssueMeta> = buildCustomFieldMeta(issue.editmeta.fields ?? {});

    const values = {
        attachments: attachments.map((a) => ({
            id: a.id,
            name: a.filename,
            size: a.sizeBytes,
        } as AttachmentFile)),
        summary: get(issue, ["fields", "summary"], ""),
        description: adfToPlainText(get(issue, ["fields", "description"])),
        issueTypeId: get(issue, ["fields", "issuetype", "id"], ""),
        projectId: get(issue, ["fields", "project", "id"], ""),
        reporterUserId: get(issue, ["fields", "reporter", "name"], ""),
        assigneeUserId: get(issue, ["fields", "assignee", "name"], ""),
        labels: get(issue, ["fields", "labels"], []) || [],
        priority: get(issue, ["fields", "priority", "id"], ""),
        customFields: Object.keys(editMeta).reduce((fields, key) => {
            const value = formatCustomFieldValueForSet(editMeta[key], get(issue, ["fields", key], null));

            if (value === undefined) {
                return fields;
            }

            return {
                ...fields,
                [key]: formatCustomFieldValueForSet(editMeta[key], get(issue, ["fields", key], null)),
            };
        }, {}),
        parentKey: get(issue, ["fields", "parent", "key"], ""),
    };

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
