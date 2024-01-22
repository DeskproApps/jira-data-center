import get from "lodash/get";
import { LinkIcon, Member } from "@deskpro/app-sdk";
import { useExternalLink } from "../../../../../../hooks";
import { nbsp } from "../../../../../../constants";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const UserPickerField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    const { getBaseUrl } = useExternalLink();

    if (!value) {
        return (<NoValue />);
    }

    return (
      <div>
        <Member
          name={get(value, ["displayName"])}
          avatarUrl={get(value, ["avatarUrls", "24x24"])}
        />
        {nbsp}
        <LinkIcon href={`${getBaseUrl()}/jira/people/${get(value, ["accountId"])}`} />
      </div>
    );
};
