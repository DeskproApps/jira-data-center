import { useStore } from "../context/StoreProvider/hooks";
import type { IssueItem } from "../services/jira/types";

const useFindLinkedIssueByKey = () => {
    const [ state ] = useStore();

    return (key: string): IssueItem|null => (state.linkedIssuesResults?.list ?? [])
        .filter((r) => r.key === key)[0] ?? null
        ;
}

export { useFindLinkedIssueByKey };
