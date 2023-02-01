import type { FC } from "react";
import type { MappedViewProps } from "../types";
import get from "lodash/get";
import { NoValue } from "../NoValue";
import { ExternalLink } from "../../ExternalLink/ExternalLink";
import { useStore } from "../../../context/StoreProvider/hooks";

export const UserPickerField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    const [ state ] = useStore();
    const domain = state.context?.settings.domain as string;

    if (!value) {
        return (<NoValue />);
    }

    return (
        <div style={{ position: "relative" }}>
            <img src={get(value, ["avatarUrls", "24x24"])} width={18} height={18} alt="" className="user-avatar" />
            <span className="user-name">{get(value, ["displayName"])}</span>
            <ExternalLink href={`https://${domain}.atlassian.net/jira/people/${get(value, ["accountId"])}`} />
        </div>
    );
};
