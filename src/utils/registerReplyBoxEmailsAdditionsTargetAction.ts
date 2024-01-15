import { ticketReplyEmailsSelectionStateKey } from "../utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { State } from "../context/StoreProvider/types";

const registerReplyBoxEmailsAdditionsTargetAction = (client: IDeskproClient, state: State) => {
  const ticketId = state?.context?.data?.ticket.id;
  const linkedIssues = (state.linkedIssuesResults?.list ?? []);

  if (!ticketId) {
    return;
  }

  Promise
    .all(linkedIssues.map((issue) => client.getState<{ selected: boolean }>(ticketReplyEmailsSelectionStateKey(ticketId, issue.id))))
    .then((flags) => {
      client.registerTargetAction("jiraReplyBoxEmailAdditions", "reply_box_email_item_selection", {
        title: "Add to JIRA",
        payload: (state.linkedIssuesResults?.list ?? []).map((issue, idx) => ({
          id: issue.id,
          title: issue.key,
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    })
  ;
};

export { registerReplyBoxEmailsAdditionsTargetAction };
