import { useStore } from "../context/StoreProvider/hooks";
import { IssueItem } from "../context/StoreProvider/types";

const useFindLinkedIssueByKey = () => {
    const [ state ] = useStore();

    return (key: string): IssueItem|null => (state.linkedIssuesResults?.list ?? [])
        .filter((r) => r.key === key)[0] ?? null
        ;
}

export { useFindLinkedIssueByKey };
