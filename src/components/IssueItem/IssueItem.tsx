import { useCallback } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import {
  Link,
  Title,
  Member,
  Property,
  TwoProperties,
} from "@deskpro/app-sdk";
import {
  useExternalLink,
  useAssociatedEntityCount,
} from "../../hooks";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import { JiraIcon } from "../common";
import type { FC, MouseEvent } from "react";
import type { IssueItem as IssueItemType } from "../../context/StoreProvider/types";

export type Props = {
  issue: IssueItemType,
  onClickTitle?: () => void,
}

export const IssueItem: FC<Props> = ({ issue, onClickTitle }) => {
  const entityCount = useAssociatedEntityCount(issue.key);
  const { getBaseUrl } = useExternalLink();
  const onClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    onClickTitle && onClickTitle();
  }, [onClickTitle]);

  return (
    <>
      <Title
        title={(
          <Link onClick={onClick} href="#">{issue.summary}</Link>
        )}
        link={`${getBaseUrl()}/browse/${issue.key}`}
        icon={<JiraIcon/>}
      />
      <TwoProperties
        leftLabel="Issue Key"
        leftText={(
          <P5>
            <span dangerouslySetInnerHTML={{__html: issue.key }}/>
            <ExternalLink href={`${getBaseUrl()}/browse/${issue.key}`}/>
          </P5>
        )}
        rightLabel="Deskpro Tickets"
        rightText={entityCount}
      />
      <Property
          label="Project"
          text={(
              <P5>
                {issue.projectName}
                <ExternalLink href={`${getBaseUrl()}/browse/${issue.projectKey}`} />
              </P5>
          )}
      />
      {issue.epicKey && (
        <Property
            label="Epic"
            text={(
                <P5>
                  {issue.epicName}
                  <ExternalLink href={`${getBaseUrl()}/browse/${issue.epicKey}`} />
                </P5>
            )}
        />
      )}
      <Property label="Status" text={issue.status} />
      <Property
        label="Reporter"
        text={!issue.reporterName ? "-" : (
          <Member
            name={issue.reporterName}
            avatarUrl={issue.reporterAvatarUrl}
          />
        )}
      />
    </>
  );
};
