import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../../context/StoreProvider/hooks";
import {
  useSetAppTitle,
  useRegisterElements,
  useLoadLinkedIssues,
} from "../../hooks";
import { Home } from "../../components";
import type { FC } from "react";
import type { IssueItem } from "../../context/StoreProvider/types";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [state] = useStore();
  const isLoading = state.linkedIssuesResults?.loading || state.linkedIssuesResults?.loading === undefined;

  const linkedIssues = useMemo(() => {
    if (!searchQuery) {
      return state.linkedIssuesResults?.list || [];
    }

    return (state.linkedIssuesResults?.list || [])
      .filter((item) => item.key.replace('-', '').toLowerCase().includes(
        searchQuery.replace('-', '').toLowerCase()
      ));
  }, [state.linkedIssuesResults, searchQuery]);

  const onNavigateToIssue = useCallback((issueKey: IssueItem["key"]) => {
    navigate(`/view/${issueKey}`)
  }, [navigate]);

  useLoadLinkedIssues();

  useSetAppTitle("JIRA Issues");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/link" },
    });
    registerElement("menu", { type: "menu", items: [
        {
          title: "View Permissions",
          payload: { type: "changePage", path: "/view_permissions" },
        },
      ]});
  }, [client, state]);

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Home
      issues={linkedIssues}
      onChangeSearch={setSearchQuery}
      onNavigateToIssue={onNavigateToIssue}
      isError={state.hasGeneratedIssueFormSuccessfully === false}
    />
  );
};

export { HomePage };
