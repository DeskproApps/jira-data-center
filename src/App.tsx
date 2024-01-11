import { useMemo, useEffect, useCallback } from "react";
import get from "lodash/get";
import noop from "lodash/noop";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Context,
  TargetAction,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient
} from "@deskpro/app-sdk";
import {
  isNavigatePayload,
  ticketReplyNotesSelectionStateKey,
  ticketReplyEmailsSelectionStateKey,
  registerReplyBoxNotesAdditionsTargetAction,
  registerReplyBoxEmailsAdditionsTargetAction,
} from "./utils";
import { addIssueComment, removeRemoteLink } from "./context/StoreProvider/api";
import { useCheckingCorrectlySettings } from "./hooks";
import { useStore } from "./context/StoreProvider/hooks";
import { ErrorBlock } from "./components/Error/ErrorBlock";
import { SettingsError } from "./components/Error/SettingsError";
import {
  Edit,
  Home,
  Link,
  View,
  Create,
  Comment,
  LoadingApp,
  VerifySettings,
  ViewPermissions,
} from "./pages";
import type { ReplyBoxNoteSelection, ElementEventPayload } from "./types";

const App = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const [state, dispatch] = useStore();
  const { isSettingsError } = useCheckingCorrectlySettings();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unlinkTicket = useCallback(({ issueKey }: any) => {
    if (!client || !ticketId || !issueKey) {
      return;
    }

    dispatch({ type: "unlinkIssue", key: issueKey });

    client.getEntityAssociation("linkedJiraDataCentreIssue", ticketId).delete(issueKey)
      .then(() => removeRemoteLink(client, issueKey, ticketId))
      .then(() => navigate("/home"));
  }, [client, navigate, dispatch, ticketId]);

  if (state._error) {
    // eslint-disable-next-line no-console
    console.error(state._error);
  }

  useEffect(() => {
    client?.registerElement("refresh", { type: "refresh_button" });
  }, [client]);

  const debounceTargetAction = useDebouncedCallback<(a: TargetAction<ReplyBoxNoteSelection[]>) => void>(
    (action: TargetAction) => {
      match<string>(action.name)
        .with("jiraReplyBoxNoteAdditions", () => (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const ticketId = action.subject;

          if (state.context?.data.ticket.id) {
            client?.setState(
              ticketReplyNotesSelectionStateKey(ticketId, selection.id),
              { id: selection.id, selected: selection.selected }
            ).then((result) => {
              if (result.isSuccess) {
                registerReplyBoxNotesAdditionsTargetAction(client, state);
              }
            });
          }
        }))
        .with("jiraReplyBoxEmailAdditions", () => (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const ticketId = action.subject;

          if (state.context?.data.ticket.id) {
            client?.setState(
              ticketReplyEmailsSelectionStateKey(ticketId, selection.id),
              { id: selection.id, selected: selection.selected }
            ).then((result) => {
              if (result.isSuccess) {
                registerReplyBoxEmailsAdditionsTargetAction(client, state);
              }
            });
          }
        }))
        .with("jiraOnReplyBoxNote", () => {
          const ticketId = action.subject;
          const note = action.payload.note;

          if (!ticketId || !note || !client) {
            return;
          }

          if (ticketId !== state.context?.data.ticket.id) {
            return;
          }

          client.setBlocking(true);
          client.getState<{ id: string; selected: boolean }>(`tickets/${ticketId}/notes/!*`)
            .then((r) => {
              const issueIds = r
                .filter(({ data }) => data?.selected)
                .map((({ data }) => data?.id as string))
              ;

              return Promise.all(issueIds.map((issueId) => addIssueComment(client, issueId, note)));
            })
            .finally(() => client.setBlocking(false))
          ;
        })
        .with("jiraOnReplyBoxEmail", () => {
          const ticketId = action.subject;
          const email = action.payload.email;

          if (!ticketId || !email || !client) {
            return;
          }

          if (ticketId !== state.context?.data.ticket.id) {
            return;
          }

          client.setBlocking(true);
          client.getState<{ id: string; selected: boolean }>(`tickets/${ticketId}/emails/!*`)
            .then((r) => {
              const issueIds = r
                .filter(({ data }) => data?.selected)
                .map((({ data }) => data?.id as string))
              ;

              return Promise.all(issueIds.map((issueId) => addIssueComment(client, issueId, email)));
            })
            .finally(() => client.setBlocking(false))
          ;
        })
        .run();
    },
    500
  );

  useInitialisedDeskproAppClient((client) => {
    registerReplyBoxNotesAdditionsTargetAction(client, state);
    registerReplyBoxEmailsAdditionsTargetAction(client, state);
    client.registerTargetAction("jiraOnReplyBoxNote", "on_reply_box_note");
    client.registerTargetAction("jiraOnReplyBoxEmail", "on_reply_box_email");
  }, [state.linkedIssuesResults?.list, state?.context?.data]);

  useDeskproAppEvents({
    onChange: (context: Context) => {
      context && dispatch({ type: "loadContext", context: context });
    },
    onShow: () => {
      client && setTimeout(() => client.resize(), 200);
    },
    onElementEvent: (id, type, payload) => {
      match<ElementEventPayload>(payload as ElementEventPayload)
        .with({ type: "changePage" }, () => {
          if (isNavigatePayload(payload as ElementEventPayload)) {
            navigate(get(payload, ["path"]));
          }
        })
        .with({ type: "unlink" }, () => unlinkTicket(payload))
        .otherwise(noop)
      ;
    },
    onTargetAction: (a) => debounceTargetAction(a as TargetAction),
  }, [client, context]);

  return (
    <>
      {state._error && (<ErrorBlock text="An error occurred" />)}
      {isSettingsError && (<SettingsError />)}
      <Routes>
        <Route path="/admin/verify_settings" element={<VerifySettings />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/link" element={<Link />}/>
        <Route path="/view/:issueKey" element={<View />}/>
        <Route path="/create" element={<Create />}/>
        <Route path="/edit" element={<Edit />}/>
        <Route path="/comment/:issueKey" element={<Comment />}/>
        <Route path="/view_permissions" element={<ViewPermissions />}/>
        <Route index  element={<LoadingApp />}/>
      </Routes>
    </>
  );
}

export { App };
