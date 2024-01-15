import { useDeskproAppClient } from "@deskpro/app-sdk";
import { getIssueAttachments } from "../services/jira";
import { useStore } from "../context/StoreProvider/hooks";

const useLoadLinkedIssueAttachment = () => {
    const { client } = useDeskproAppClient();
    const [, dispatch] = useStore();

    return async (key: string) => {
        if (!client) {
            return;
        }

        dispatch({ type: "issueAttachmentsLoading" });

        try {
            const attachments = await getIssueAttachments(client, key);

            dispatch({ type: "issueAttachments", key, attachments })
        } catch (e) {
            dispatch({ type: "error", error: `${e}` });
        }
    };
};

export { useLoadLinkedIssueAttachment };
