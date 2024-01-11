import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LoadingSpinner,
  HorizontalDivider,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { H3 } from "@deskpro/deskpro-ui";
import {
  useSetAppTitle,
  useRegisterElements,
  useLoadLinkedIssues,
} from "../hooks";
import { LinkedIssueResultItem } from "../components/LinkedIssueResultItem/LinkedIssueResultItem";
import { ErrorBlock } from "../components/Error/ErrorBlock";

export const Home: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [state] = useStore();

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

  const linkedIssues = useMemo(() => {
    if (!searchQuery) {
      return state.linkedIssuesResults?.list || [];
    }

    return (state.linkedIssuesResults?.list || [])
      .filter((item) => item.key.replace('-', '').toLowerCase().includes(
        searchQuery.replace('-', '').toLowerCase()
      ));
  }, [state.linkedIssuesResults, searchQuery]);

  useLoadLinkedIssues();

  const loading = state.linkedIssuesResults?.loading || state.linkedIssuesResults?.loading === undefined;

  return (
    <>
      {state.hasGeneratedIssueFormSuccessfully === false && (
          <ErrorBlock text="You cannot create issue type via this app, please visit JIRA" />
      )}
      <Search onChange={setSearchQuery} />
      <HorizontalDivider style={{ marginTop: "8px", marginBottom: "8px" }} />
      {loading
          ? <LoadingSpinner />
          : (Array.isArray(linkedIssues) && linkedIssues.length > 0)
          ? linkedIssues.map((item, idx) => (
            <LinkedIssueResultItem
              key={idx}
              item={item}
              onView={() => navigate(`/view/${item.key}`)}
            />
          ))
          : <H3>No linked issues found.</H3>
      }
    </>
  );
};
