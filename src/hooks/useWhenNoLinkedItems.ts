import { useEffect } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";

const useWhenNoLinkedItems = (onNoLinkedItems: () => void) => {
    const { client } = useDeskproAppClient();
    const [ state ] = useStore();

    useEffect(() => {
        if (!client || !state.context?.data.ticket.id) {
            return;
        }

        client
            .getEntityAssociation("linkedJiraDataCentreIssue", state.context?.data.ticket.id as string)
            .list()
            .then((items) => items.length === 0 && onNoLinkedItems())
        ;
    }, [client, state.context?.data.ticket.id, onNoLinkedItems]);
};

export { useWhenNoLinkedItems };
