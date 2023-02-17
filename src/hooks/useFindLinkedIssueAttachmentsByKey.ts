import { useStore } from "../context/StoreProvider/hooks";
import { IssueAttachment } from "../context/StoreProvider/types";

const useFindLinkedIssueAttachmentsByKey = () => {
    const [ state ] = useStore();

    return (key: string): IssueAttachment[] => (state.linkedIssueAttachments?.list ?? {})[key] ?? [];
}

export { useFindLinkedIssueAttachmentsByKey };
