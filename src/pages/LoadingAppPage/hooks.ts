import { useMemo } from "react";
import { get, size, find } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  setEntityService,
  deleteEntityService,
  getEntityListService,
} from "../../services/deskpro";
import { listLinkedIssues } from "../../services/jira";
import {IssueItem} from "../../services/jira/types";

const useLoadingApp = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    (async () => {
      const ids = await getEntityListService(client, ticketId);
      const issues = await listLinkedIssues(client, ids);

      const idToKeyUpdates = ids.filter((issueId) => /^[0-9]+$/.test(issueId.toString()))
        .map((issueId) => {
          const issue = find(issues, { id: `${issueId}` }) as IssueItem|undefined;

          if (issue?.key) {
            return Promise.all([
              deleteEntityService(client, ticketId, issueId),
              setEntityService(client, ticketId, issue.key),
            ]);
          }

          return null;
        }).filter((update) => !!update);

      await Promise.all(idToKeyUpdates);
      await getEntityListService(client, ticketId)
        .then((items) => navigate(size(items) ? "/home" : "/link"));
    })();
  }, [ticketId, navigate]);
};

export { useLoadingApp };
