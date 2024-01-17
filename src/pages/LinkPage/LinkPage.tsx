import { useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {
  useSearch,
  useSetAppTitle,
  useRegisterElements,
} from "../../hooks";
import { addRemoteLink, getIssueByKey } from "../../services/jira";
// import { CreateLinkIssue } from "../components/CreateLinkIssue/CreateLinkIssue";
import { ticketReplyEmailsSelectionStateKey, ticketReplyNotesSelectionStateKey } from "../../utils";
import { Link } from "../../components";
import type { FC } from "react";
import type { IssueItem } from "../../services/jira/types";

const LinkPage: FC = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selected, setSelected] = useState<Array<IssueItem["key"]>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { client } = useDeskproAppClient();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
  const { issues, isLoading } = useSearch(searchQuery);

  useSetAppTitle("Add Issues");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  }, [client]);

  const onChangeSearchQuery = useDebouncedCallback(setSearchQuery, 1000);

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

    setIsSubmitting(true);

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
      .finally(() => setIsSubmitting(false))
    ;
  }, [context, ticketId, client, selected, navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  return (
    <>
      {/*<CreateLinkIssue selected="link" />*/}
      <Link
        isFetching={isLoading}
        onChangeSearch={onChangeSearchQuery}
        isSubmitting={isSubmitting}
        onLinkIssues={linkIssues}
        onCancel={onCancel}
        issues={issues}
        selectedIssueIds={selected}
        onChangeSelectedIssue={onChangeSelectedIssue}
      />
    </>
  );
};

export { LinkPage };
