import { useMemo, useState, useCallback } from "react";
import { toLower } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  useSetAppTitle,
  useLinkedIssues,
  useSetBadgeCount,
  useRegisterElements,
} from "../../hooks";
import { Home } from "../../components";
import type { FC } from "react";
import type { IssueItem } from "../../services/jira/types";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { issues, isLoading } = useLinkedIssues();

  const linkedIssues = useMemo(() => {
    if (!searchQuery) {
      return issues || [];
    }

    return (issues || []).filter((item) => {
      return toLower(item.key.replace('-', ''))
        .includes(toLower(searchQuery.replace('-', '')))
    });
  }, [issues, searchQuery]);

  const onNavigateToIssue = useCallback((issueKey: IssueItem["key"]) => {
    navigate(`/view/${issueKey}`)
  }, [navigate]);

  useSetAppTitle("JIRA Issues");

  useSetBadgeCount(issues);

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
  }, [client]);

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
    />
  );
};

export { HomePage };
