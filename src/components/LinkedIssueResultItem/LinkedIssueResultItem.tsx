import { H1, P5, Stack } from "@deskpro/deskpro-ui";
import {
  Property,
  TwoProperties,
  HorizontalDivider,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { FC, Fragment, ReactElement } from "react";
import { IssueItem } from "../../context/StoreProvider/types";
import "./LinkedIssueResultItem.css";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import {
  useExternalLink,
  useAssociatedEntityCount,
} from "../../hooks";

export interface LinkedIssueResultItemProps {
  item: IssueItem;
  checkbox?: ReactElement;
  onView?: () => void;
}

export const LinkedIssueResultItem: FC<LinkedIssueResultItemProps> = ({ item, checkbox, onView }: LinkedIssueResultItemProps) => {
  const { theme } = useDeskproAppTheme();
  const entityCount = useAssociatedEntityCount(item.key);
  const { getBaseUrl } = useExternalLink();

  return (
    <Fragment>
      <Stack align="start" gap={10}>
        {checkbox && checkbox}
        <Stack gap={10} vertical>
          <div style={{ display: "flex", alignItems: "start" }}>
            <H1 onClick={() => onView && onView()} style={{ color: theme.colors.cyan100, cursor: "pointer", marginRight: "1px" }}>{item.summary}</H1>
            <ExternalLink href={`${getBaseUrl()}/browse/${item.key}`} style={{ position: "relative", top: "-4px" }} />
          </div>
          <TwoProperties
              leftLabel="Issue Key"
              leftText={(
                <P5>
                  <span>{item.key}</span>
                  <ExternalLink href={`${getBaseUrl()}/browse/${item.key}`}/>
                </P5>
              )}
              rightLabel="Deskpro Tickets" rightText={entityCount}
          />
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
          <Property label="Status" text={item.status}/>
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
    </Fragment>
  );
};
