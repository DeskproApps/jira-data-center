import { useDeskproAppClient } from "@deskpro/app-sdk";
import { listLinkedIssues } from "../context/StoreProvider/api";
import { useStore } from "../context/StoreProvider/hooks";

const useLoadLinkedIssues = () => {
    const { client } = useDeskproAppClient();
    const [ state, dispatch ] = useStore();

    return async () => {
        if (!client || !state.context?.data.ticket.id) {
            return;
        }

        try {
            const keys = await client
                .getEntityAssociation("linkedJiraDataCentreIssue", state.context?.data.ticket.id as string)
                .list();

            client.setBadgeCount(keys.length);

            const list = await listLinkedIssues(client, keys);

            const idToKeyUpdates = keys.filter((key) => /^[0-9]+$/.test(key.toString())).map((id) => {
                const item = list.filter((item) => item.id.toString() === id.toString())[0];
                if (item) {
                    return Promise.all([
                        client.getEntityAssociation("linkedJiraDataCentreIssue", state.context?.data.ticket.id as string).delete(id),
                        client.getEntityAssociation("linkedJiraDataCentreIssue", state.context?.data.ticket.id as string).set(item.key),
                    ]);
                }

                return null;
            }).filter((update) => !!update);

            await Promise.all(idToKeyUpdates);

            dispatch({ type: "linkedIssuesList", list });
        } catch (e) {
            dispatch({ type: "error", error: `${e}` });
        }
    };
};

export { useLoadLinkedIssues };
