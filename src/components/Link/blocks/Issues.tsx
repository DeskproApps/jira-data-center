import { Fragment } from "react";
import { Checkbox } from "@deskpro/deskpro-ui";
import { LoadingSpinner, HorizontalDivider } from "@deskpro/app-sdk";
import { NoFoundIssues, Card } from "../../common";
import { IssueItem } from "../../IssueItem";
import type { FC } from "react";
import type { IssueItem as IssueItemType } from "../../../services/jira/types";
import type { IssueKey } from "../../../types";

type Props = {
  isLoading?: boolean,
  issues?: IssueItemType[],
  selectedIssueIds: IssueKey[],
  onChangeSelectedIssue: (issueKey: IssueKey) => void,
};

const Issues: FC<Props> = ({
  issues,
  isLoading,
  selectedIssueIds,
  onChangeSelectedIssue,
}) => {
  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <NoFoundIssues issues={issues}>
      {(issues) => issues.map((issue) => (
        <Fragment key={issue.id}>
          <Card>
            <Card.Media>
              <Checkbox
                size={12}
                containerStyle={{ marginTop: 4 }}
                onChange={() => onChangeSelectedIssue(issue.key)}
                checked={selectedIssueIds.includes(issue.key)}
              />
            </Card.Media>
            <Card.Body>
              <IssueItem
                issue={issue}
                onClickTitle={() => onChangeSelectedIssue(issue.key)}
              />
            </Card.Body>
          </Card>
          <HorizontalDivider style={{ marginBottom: 6 }} />
        </Fragment>
      ))}
    </NoFoundIssues>
  );
};

export { Issues };
