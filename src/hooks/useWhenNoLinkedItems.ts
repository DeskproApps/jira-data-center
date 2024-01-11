import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

const useWhenNoLinkedItems = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    client
      .getEntityAssociation("linkedJiraDataCentreIssue", ticketId as string)
      .list()
      .then((items) => {
        const page = (Array.isArray(items) && size(items) > 0) ? "/home" : "/link";
        navigate(page);
      });
  }, [ticketId, navigate]);
};

export { useWhenNoLinkedItems };
