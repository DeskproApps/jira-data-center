import { useMemo } from "react";
import { get, size } from "lodash";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useAsyncError } from "../../hooks";
import { getEntityListService } from "../../services/deskpro";
import {
  JiraError,
  getCurrentUser,
  replaceIssueIdToKey,
} from "../../services/jira";
import { STATUS } from "../../constants";
import type { TicketContext } from "../../types";

const useLoadingApp = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const settings = useMemo(() => get(context, ["settings"]), [context]);
  const isAdmin = useMemo(() => pathname.includes("/admin/"), [pathname]);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId || !asyncErrorHandler) {
      return;
    }

    if (isAdmin && (!settings?.api_key || !settings?.instance_url)) {
      return asyncErrorHandler(new JiraError({ status: STATUS.Forbidden }))
    }

    replaceIssueIdToKey(client, ticketId)
      .then(() => getCurrentUser(client))
      .then(() => getEntityListService(client, ticketId))
      .then((items) => navigate(size(items) ? "/home" : "/link"))
      .catch(asyncErrorHandler)
  }, [ticketId, navigate, asyncErrorHandler, settings, isAdmin]);
};

export { useLoadingApp };
