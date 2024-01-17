import { useCallback, useContext, createContext } from "react";
import { get, map, size, noop } from "lodash";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLinkedIssues } from "./useLinkedIssues";
import { getEntityListService } from "../services/deskpro";
import { addIssueComment } from "../services/jira";
import { queryClient } from "../query";
import { APP_PREFIX } from "../constants";
import type { FC, PropsWithChildren } from "react";
import type { IDeskproClient, GetStateResponse, TargetAction } from "@deskpro/app-sdk";
import type { IssueItem } from "../services/jira/types";
import type { TicketContext, TicketData } from "../types";

export type ReplyBoxType = "note" | "email";

export type SetSelectionState = (
  issueKey: IssueItem["key"],
  selected: boolean,
  type: ReplyBoxType,
) => void|Promise<{ isSuccess: boolean }|void>;

export type GetSelectionState = (
  issueKey: IssueItem["key"],
  type: ReplyBoxType,
) => void|Promise<Array<GetStateResponse<string>>>;

export type DeleteSelectionState = (issueKey: IssueItem["key"], type: ReplyBoxType) => void|Promise<boolean|void>;

type ReturnUseReplyBox = {
  setSelectionState: SetSelectionState,
  getSelectionState: GetSelectionState,
  deleteSelectionState: DeleteSelectionState,
};

const noteKey = (ticketId: string, issueKey: IssueItem["key"]|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/notes/selection/${issueKey}`.toLowerCase();
};

const emailKey = (ticketId: string, issueKey: IssueItem["key"]|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/emails/selection/${issueKey}`.toLowerCase();
};

const registerReplyBoxNotesAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  issueKeys: Array<IssueItem["key"]>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(issueKeys) && !size(issueKeys)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`);
  }

  return Promise
    .all(issueKeys.map((issueKey: IssueItem["key"]) => {
      return client.getState<{ selected: boolean }>(noteKey(ticketId, issueKey));
    }))
    .then((flags) => {
      client.registerTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`, "reply_box_note_item_selection", {
        title: "Add to JIRA",
        payload: issueKeys.map((issueKey, idx) => ({
          id: issueKey,
          title: issueKey,
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    })
    ;
};

const registerReplyBoxEmailsAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  issueKeys: Array<IssueItem["key"]>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(issueKeys) && !size(issueKeys)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`);
  }

  return Promise
    .all(issueKeys.map((issueKey: IssueItem["key"]) => {
      return client.getState<{ selected: boolean }>(emailKey(ticketId, issueKey))
    }))
    .then((flags) => {
      return client.registerTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`, "reply_box_email_item_selection", {
        title: `Add to JIRA`,
        payload: issueKeys.map((issueKey, idx) => ({
          id: issueKey,
          title: issueKey,
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    });
};

const ReplyBoxContext = createContext<ReturnUseReplyBox>({
  setSelectionState: noop,
  getSelectionState: noop,
  deleteSelectionState: noop,
});

const useReplyBox = () => useContext<ReturnUseReplyBox>(ReplyBoxContext);

const ReplyBoxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { client } = useDeskproAppClient();
  const { issues } = useLinkedIssues();
  const ticketId = get(context, ["data", "ticket", "id"]);
  const isCommentOnNote = get(context, ["settings", "default_comment_on_ticket_note"]);
  const isCommentOnEmail = get(context, ["settings", "default_comment_on_ticket_reply"]);

  const setSelectionState: SetSelectionState = useCallback((issueKey, selected, type) => {
    if (!ticketId || !client) {
      return
    }

    if (type === "note" && isCommentOnNote) {
      return client.setState(noteKey(ticketId, issueKey), { id: issueKey, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((issueKeys) => registerReplyBoxNotesAdditionsTargetAction(client, ticketId, issueKeys))
        .catch(noop)
    }

    if (type === "email" && isCommentOnEmail) {
      return client?.setState(emailKey(ticketId, issueKey), { id: issueKey, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((issueKeys) => registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, issueKeys))
        .catch(noop)
    }
  }, [client, ticketId, isCommentOnNote, isCommentOnEmail]);

  const getSelectionState: GetSelectionState = useCallback((issueKey, type) => {
    if (!ticketId) {
      return
    }

    const key = (type === "email") ? emailKey : noteKey;
    return client?.getState<string>(key(ticketId, issueKey))
  }, [client, ticketId]);

  const deleteSelectionState: DeleteSelectionState = useCallback((issueKey, type) => {
    if (!ticketId || !client) {
      return;
    }

    const key = (type === "email") ? emailKey : noteKey;

    return client.deleteState(key(ticketId, issueKey))
      .then(() => getEntityListService(client, ticketId))
      .then((issueKeys) => {
        const register = (type === "email") ? registerReplyBoxEmailsAdditionsTargetAction : registerReplyBoxNotesAdditionsTargetAction;
        return register(client, ticketId, issueKeys);
      })
  }, [client, ticketId]);

  useInitialisedDeskproAppClient((client) => {
    if (isCommentOnNote) {
      registerReplyBoxNotesAdditionsTargetAction(client, ticketId, map(issues, "key"));
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxNote`, "on_reply_box_note");
    }

    if (isCommentOnEmail) {
      registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, map(issues, "key"));
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxEmail`, "on_reply_box_email");
    }
  }, [issues, ticketId, isCommentOnNote, isCommentOnEmail]);

  const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>((action: TargetAction) => match<string>(action.name)
      .with(`${APP_PREFIX}OnReplyBoxEmail`, () => {
        const subjectTicketId = action.subject;
        const email = action.payload.email;

        if (!ticketId || !email || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(emailKey(ticketId, "*"))
          .then((selections) => {
            const issueKeys = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id as IssueItem["key"]);

            return Promise
              .all(issueKeys.map((issueKey) => addIssueComment(client, issueKey, email)))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}OnReplyBoxNote`, () => {
        const subjectTicketId = action.subject;
        const note = action.payload.note;

        if (!ticketId || !note || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(noteKey(ticketId, "*"))
          .then((selections) => {
            const issueKeys = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id as IssueItem["key"]);

            return Promise
              .all(issueKeys.map((issueKey) => addIssueComment(client, issueKey, note)))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}ReplyBoxEmailAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(emailKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {

                if (result.isSuccess) {
                  registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, map(issues, "key"));
                }
              });
          }
        })
      })
      .with(`${APP_PREFIX}ReplyBoxNoteAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(noteKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {
                if (result.isSuccess) {
                  registerReplyBoxNotesAdditionsTargetAction(client, subjectTicketId, map(issues, "key"));
                }
              });
          }
        })
      })
      .run(),
    200
  );

  useDeskproAppEvents({
    onTargetAction: debounceTargetAction,
  }, [context?.data]);

  return (
    <ReplyBoxContext.Provider value={{
      setSelectionState,
      getSelectionState,
      deleteSelectionState,
    }}>
      {children}
    </ReplyBoxContext.Provider>
  );
};

export { useReplyBox, ReplyBoxProvider };
