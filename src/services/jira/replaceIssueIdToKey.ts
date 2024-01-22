import { find } from "lodash";
import {
  deleteEntityService,
  getEntityListService, setEntityService,
} from "../deskpro";
import { listLinkedIssues } from "./listLinkedIssues";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Maybe } from "../../types";
import type { IssueItem } from "./types";

const replaceIssueIdToKey = async (
  client: IDeskproClient,
  ticketId: string,
) => {
  const ids = await getEntityListService(client, ticketId);
  const issues = await listLinkedIssues(client, ids);
  const filteredIds = ids.filter((issueId) => /^[0-9]+$/.test(issueId.toString()));

  return Promise.all(filteredIds.map((issueId) => {
    const issue = find(issues, { id: `${issueId}` }) as Maybe<IssueItem>;
    return (!issue?.key)
      ? Promise.resolve()
      : Promise.all([
        deleteEntityService(client, ticketId, issueId),
        setEntityService(client, ticketId, issue.key),
      ]);
  }));
};

export { replaceIssueIdToKey };
