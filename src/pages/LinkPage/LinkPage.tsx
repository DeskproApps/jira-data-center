import { useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useStore } from "../../context/StoreProvider/hooks";
import {
  useSetAppTitle,
  useRegisterElements,
} from "../../hooks";
import { addRemoteLink, getIssueByKey, searchIssues } from "../../context/StoreProvider/api";
// import { CreateLinkIssue } from "../components/CreateLinkIssue/CreateLinkIssue";
import { ticketReplyEmailsSelectionStateKey, ticketReplyNotesSelectionStateKey } from "../../utils";
import { Link } from "../../components";
import type { FC } from "react";
import type { IssueKey } from "../../types";

const LinkPage: FC = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const [state, dispatch] = useStore();
  const [selected, setSelected] = useState<IssueKey[]>([]);
  const [isLinkIssuesLoading, setIsLinkIssuesLoading] = useState<boolean>(false);
  const { client } = useDeskproAppClient();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  useSetAppTitle("Add Issues");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  }, [client]);

  const debounced = useDebouncedCallback<(v: string) => void>((q) => {
    if (!q || !client) {
      dispatch({ type: "linkIssueSearchList", list: [] });
      return;
    }

    searchIssues(client, q, { withSubtask: true })
      .then((list) =>  dispatch({ type: "linkIssueSearchList", list }));
  },500);

  const search = (q: string) => {
    dispatch({ type: "linkIssueSearchListLoading" });
    debounced(q);
  };

  const onChangeSelectedIssue = (key: string) => {
    if (selected.includes(key)) {
      setSelected(selected.filter((s) => s !== key));
    } else {
      setSelected([...selected, key]);
    }
  };

  const linkIssues = useCallback(() => {
    if (!selected.length || !client || !ticketId) {
      return;
    }

    const commentOnNote = context?.settings?.default_comment_on_ticket_note === true;
    const commentOnReply = context?.settings?.default_comment_on_ticket_reply === true;

    setIsLinkIssuesLoading(true);

    const updates = selected.map(async (key: string) => {
      const issue = await getIssueByKey(client, key);

      return client
          .getEntityAssociation("linkedJiraDataCentreIssue", ticketId)
          .set(key, issue)
          .then(async () => commentOnNote && client?.setState(ticketReplyNotesSelectionStateKey(ticketId, issue.id), {
            id: issue.id,
            selected: true,
          }))
          .then(async () => commentOnReply && client?.setState(ticketReplyEmailsSelectionStateKey(ticketId, issue.id), {
            id: issue.id,
            selected: true,
          }))
      ;
    });

    updates.push(...selected.map((key: string) => addRemoteLink(
        client,
        key,
        context?.data.ticket.id as string,
        context?.data.ticket.subject as string,
        context?.data.ticket.permalinkUrl as string
    )));

    Promise.all(updates)
      .then(() => navigate("/home"))
      .catch((error) => dispatch({ type: "error", error }))
      .finally(() => setIsLinkIssuesLoading(false))
    ;
  }, [context, ticketId, dispatch, client, selected, navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  return (
    <>
      {/*<CreateLinkIssue selected="link" />*/}
      <Link
        isFetching={state.linkIssueSearchResults?.loading}
        onChangeSearch={search}
        isSubmitting={isLinkIssuesLoading}
        onLinkIssues={linkIssues}
        onCancel={onCancel}
        selectedIssues={selected}
        issues={get(state, ["linkIssueSearchResults", "list"], [])}
        selectedIssueIds={selected}
        onChangeSelectedIssue={onChangeSelectedIssue}
      />
    </>
  );
};

export { LinkPage };
