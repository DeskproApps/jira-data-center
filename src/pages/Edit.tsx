import {FC, useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { IssueForm } from "../components/IssueForm/IssueForm";
import {
    buildCustomFieldMeta,
    formatCustomFieldValueForSet,
    getIssueByKey, updateIssue
} from "../context/StoreProvider/api";
import { useDeskproAppClient, LoadingSpinner } from "@deskpro/app-sdk";
import {
    IssueFormData,
    AttachmentFile,
    JiraIssueDetails,
    InvalidRequestResponseError,
} from "../context/StoreProvider/types";
import {
    useAdfToPlainText,
    useFindLinkedIssueAttachmentsByKey,
    useLoadLinkedIssueAttachment,
    useLoadLinkedIssues,
    useSetAppTitle
} from "../hooks";
import { useStore } from "../context/StoreProvider/hooks";
import { FormikHelpers } from "formik";
import { IssueMeta } from "../types";
import { SubmitIssueFormData } from "../components/IssueForm/types";

interface EditProps {
    issueKey: string;
}

export const Edit: FC<EditProps> = ({ issueKey }: EditProps) => {
    const { client } = useDeskproAppClient();
    const [ state, dispatch ] = useStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<Record<string, string>|undefined>({});
    const [issue, setIssue] = useState<null|JiraIssueDetails>(null);

    const adfToPlainText = useAdfToPlainText();

    const loadIssues = useLoadLinkedIssues();
    const loadIssueAttachments = useLoadLinkedIssueAttachment();
    const findAttachmentsByKey = useFindLinkedIssueAttachmentsByKey();

    useSetAppTitle(`Edit ${issueKey}`);

    useEffect(() => {
        client?.registerElement("home", { type: "home_button" });
        client?.deregisterElement("homeContextMenu");
        client?.deregisterElement("edit");
        client?.deregisterElement("viewContextMenu");
    }, [client, issueKey]);

    useEffect(() => {
        (client && issueKey) && getIssueByKey(client, issueKey).then(setIssue);
    }, [client, issueKey])

    useEffect(() => {
        loadIssueAttachments(issueKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issueKey]);

    const attachments = useMemo(
        () => findAttachmentsByKey(issueKey),
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
        if (!client || !state.context?.data.ticket || !issueKey) {
            return;
        }

        setLoading(true);
        setApiErrors({});

        updateIssue(client, issueKey, data, meta)
            .then(async () => {
                const issue = await getIssueByKey(client, issueKey);

                return client
                    .getEntityAssociation("linkedJiraDataCentreIssue", state.context?.data.ticket.id as string)
                    .set(issueKey, issue)
                ;
            })
            .then(() => loadIssues())
            .then(() => {
                setLoading(false);
                dispatch({ type: "changePage", page: "view", params: { issueKey } });
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
