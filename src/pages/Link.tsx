import { FC, useRef, useEffect, useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreProvider/hooks";
import {
  H3,
  Stack,
  Button,
  Checkbox,
} from "@deskpro/deskpro-ui";
import {
  Search,
  HorizontalDivider,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useDebouncedCallback } from "use-debounce";
import {
  useSetAppTitle,
  useRegisterElements,
} from "../hooks";
import { SearchResultItem } from "../components/SearchResultItem/SearchResultItem";
import { addRemoteLink, getIssueByKey, searchIssues } from "../context/StoreProvider/api";
// import { CreateLinkIssue } from "../components/CreateLinkIssue/CreateLinkIssue";
import { ticketReplyEmailsSelectionStateKey, ticketReplyNotesSelectionStateKey } from "../utils";

export const Link: FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const [state, dispatch] = useStore();
  const [selected, setSelected] = useState<string[]>([]);
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

  useEffect(
    () => searchInputRef && searchInputRef.current?.focus(),
    [searchInputRef]
  );

  const search = (q: string) => {
    dispatch({ type: "linkIssueSearchListLoading" });
    debounced(q);
  };

  const toggleSelection = (key: string) => {
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

  return (
    <>
      {/*<CreateLinkIssue selected="link" />*/}
      <Search
          isFetching={state.linkIssueSearchResults?.loading}
          onChange={search}
      />
      <HorizontalDivider style={{ marginTop: "8px", marginBottom: "8px" }} />
      <Stack justify="space-between">
        <Button
          text="Link Issues"
          disabled={selected.length === 0}
          onClick={() => linkIssues()}
          loading={isLinkIssuesLoading}
        />
        <Button
          text="Cancel"
          intent="secondary"
          onClick={() => navigate("/home")}
        />
      </Stack>
      <HorizontalDivider style={{ marginTop: "8px", marginBottom: "8px" }} />
      {state.linkIssueSearchResults && state.linkIssueSearchResults.list.map((item, idx) => (
        <SearchResultItem
          key={idx}
          item={item}
          onSelect={() => toggleSelection(item.key)}
          checkbox={(
            <Checkbox
              onChange={() => toggleSelection(item.key)}
              checked={selected.includes(item.key)}
            />
          )}
        />
      ))}
      {(state.linkIssueSearchResults && !state.linkIssueSearchResults.list.length && !state.linkIssueSearchResults.loading) && (
        <H3>No matching issues found, please try again</H3>
      )}
    </>
  );
};
