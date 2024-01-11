import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { listLinkedIssues } from "../context/StoreProvider/api";
import { useStore } from "../context/StoreProvider/hooks";

const useLoadLinkedIssues = () => {
    const { context } = useDeskproLatestAppContext();
    const [state, dispatch] = useStore();
    const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);


  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    (async () => {
      try {
        const keys = await client.getEntityAssociation("linkedJiraDataCentreIssue", ticketId as string).list();

        client.setBadgeCount(Array.isArray(keys) ? size(keys) : 0);

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
    })();
  }, [ticketId]);
};

export { useLoadLinkedIssues };
