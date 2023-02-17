import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getIssueComments } from "../context/StoreProvider/api";
import { useStore } from "../context/StoreProvider/hooks";
import { JiraComment } from "../context/StoreProvider/types";

const useFindIssueComments = (issueKey: string): JiraComment[]|null => {
    const [ state , dispatch ] = useStore();

    useInitialisedDeskproAppClient((client) => {
        if (!issueKey) {
            return;
        }

        getIssueComments(client, issueKey)
            .then((comments) => dispatch({ type: "issueComments", key: issueKey, comments }))
        ;
    }, [issueKey]);

    if (!state?.issueComments || !state?.issueComments[issueKey]) {
        return null;
    }

    return state?.issueComments[issueKey];
};

export { useFindIssueComments };
