import { H1, Stack } from "@deskpro/deskpro-ui";
import {
  HorizontalDivider,
  Property,
  useDeskproAppTheme,
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
            <Property
                label="Issue Key"
                text={(
                    <>
                      <span dangerouslySetInnerHTML={{__html: item.keyHtml ? item.keyHtml : item.key}}/>
                      <ExternalLink href={`${getBaseUrl()}/browse/${item.key}`}/>
                    </>
                )}
            />
            <VerticalDivider width={1}/>
            <Property label="Deskpro Tickets" text={entityCount}/>
          </Stack>
          <Property
              label="Project"
              text={(
                  <>
                    {item.projectName}
                    <ExternalLink href={`${getBaseUrl()}/browse/${item.projectKey}`} />
                  </>
              )}
          />
          {item.epicKey && (
            <Property
                label="Epic"
                text={(
                    <>
                      {item.epicName}
                      <ExternalLink href={`${getBaseUrl()}/browse/${item.epicKey}`} />
                    </>
                )}
            />
          )}
          <Property label="Status" text={item.status} />
          <Property
              label="Reporter"
              text={(
                  <div style={{position: "relative"}}>
                    {item.reporterAvatarUrl && (
                        <img src={item.reporterAvatarUrl} width={18} height={18} alt="" className="user-avatar"/>
                    )}
                    <span className="user-name">{item.reporterName}</span>
                    {item.reporterId && (
                        <ExternalLink href={`${getBaseUrl()}/jira/people/${item.reporterId}`}/>
                    )}
                  </div>
              )}
          />
        </Stack>
      </Stack>
      <HorizontalDivider style={{marginTop: "8px", marginBottom: "8px"}}/>
    </>
  );
};
