import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getIssueComments } from "../services/jira";
import { useStore } from "../context/StoreProvider/hooks";
import type { Maybe } from "../types";
import type { JiraComment } from "../services/jira/types";

const useFindIssueComments = (issueKey: string): Maybe<JiraComment[]> => {
  const [state, dispatch] = useStore();

  useInitialisedDeskproAppClient((client) => {
    if (!issueKey) {
      return;
    }

    getIssueComments(client, issueKey)
      .then((comments) => dispatch({ type: "issueComments", key: issueKey, comments }));
  }, [issueKey]);

  if (!state?.issueComments || !state?.issueComments[issueKey]) {
    return null;
  }

  return state?.issueComments[issueKey];
};

export {useFindIssueComments};
