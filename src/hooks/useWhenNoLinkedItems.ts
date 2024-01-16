import { useMemo } from "react";
import { get, size } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityListService } from "../services/deskpro";

const useWhenNoLinkedItems = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    return getEntityListService(client, ticketId)
      .then((items) => navigate(size(items) ? "/home" : "/link"));
  }, [ticketId, navigate]);
};

export { useWhenNoLinkedItems };
