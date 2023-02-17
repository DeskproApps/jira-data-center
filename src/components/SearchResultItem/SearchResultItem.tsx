import {
  H1,
  HorizontalDivider,
  Property,
  Stack, useDeskproAppTheme,
  VerticalDivider
} from "@deskpro/app-sdk";
import { FC, ReactElement } from "react";
import { IssueSearchItem } from "../../context/StoreProvider/types";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import "./SearchResultItem.css";
import {
  useExternalLink,
  useAssociatedEntityCount,
} from "../../hooks";

export interface SearchResultItemProps {
  item: IssueSearchItem;
  checkbox?: ReactElement;
  onSelect?: () => void;
}

export const SearchResultItem: FC<SearchResultItemProps> = ({ item, checkbox, onSelect }: SearchResultItemProps) => {
  const { theme } = useDeskproAppTheme();
  const entityCount = useAssociatedEntityCount(item.key);
  const { getBaseUrl } = useExternalLink();

  return (
    <>
      <Stack align="start" gap={10}>
        {checkbox && checkbox}
        <Stack gap={10} vertical>
          <div style={{ display: "flex", alignItems: "start" }}>
            <H1 onClick={() => onSelect && onSelect()} style={{ color: theme.colors.cyan100, cursor: "pointer", marginRight: "1px" }}>{item.summary}</H1>
            <ExternalLink href={`${getBaseUrl()}/browse/${item.key}`} style={{ position: "relative", top: "-4px" }} />
          </div>
          <Stack align="stretch">
            <Property title="Issue Key" width="108px">
              <span dangerouslySetInnerHTML={{ __html: item.keyHtml ? item.keyHtml : item.key }} />
              <ExternalLink href={`${getBaseUrl()}/browse/${item.key}`} />
            </Property>
            <VerticalDivider width={1} />
            <Property title="Deskpro Tickets">
              {entityCount}
            </Property>
          </Stack>
          <Property title="Project">
            {item.projectName}
            <ExternalLink href={`${getBaseUrl()}/browse/${item.projectKey}`} />
          </Property>
          {item.epicKey && (
            <Property title="Epic">
              {item.epicName}
              <ExternalLink href={`${getBaseUrl()}/browse/${item.epicKey}`} />
            </Property>
          )}
          <Property title="Status">
            {item.status}
          </Property>
          <Property title="Reporter">
            <div style={{ position: "relative" }}>
              {item.reporterAvatarUrl && (
                  <img src={item.reporterAvatarUrl} width={18} height={18} alt="" className="user-avatar" />
              )}
              <span className="user-name">{item.reporterName}</span>
              {item.reporterId && (
                  <ExternalLink href={`${getBaseUrl()}/jira/people/${item.reporterId}`} />
              )}
            </div>
          </Property>
        </Stack>
      </Stack>
      <HorizontalDivider style={{ marginTop: "8px", marginBottom: "8px" }} />
    </>
  );
};
