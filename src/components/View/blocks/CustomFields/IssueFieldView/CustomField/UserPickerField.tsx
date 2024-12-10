import { Stack } from "@deskpro/deskpro-ui";
import { LinkIcon, Member } from "@deskpro/app-sdk";
import { useExternalLink } from "../../../../../../hooks";
import { nbsp } from "../../../../../../constants";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";
import type { JiraUser } from "../../../../../../services/jira/types";

export const UserPickerField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    const { getBaseUrl } = useExternalLink();

    if (!value) {
        return (<NoValue />);
    }

    return (
      <Stack gap={6} align="end">
        <Member
          name={(value as JiraUser).displayName}
          avatarUrl={(value as JiraUser).avatarUrls["24x24"]}
        />
        {nbsp}
        <LinkIcon href={`${getBaseUrl()}/jira/people/${(value as JiraUser).accountId}`} />
      </Stack>
    );
};
