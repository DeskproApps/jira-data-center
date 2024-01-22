import { Fragment } from "react";
import { Search, HorizontalDivider } from "@deskpro/app-sdk";
import { Container, NoFoundIssues } from "../common";
import { IssueItem } from "../IssueItem";
import type { FC } from "react";
import type { IssueItem as IssueItemType } from "../../services/jira/types";


type Props = {
  issues: IssueItemType[],
  onChangeSearch: (q: string) => void,
  onNavigateToIssue: (issueKey: IssueItemType["key"]) => void,
};

const Home: FC<Props> = ({
  issues,
  onChangeSearch,
  onNavigateToIssue,
}) => {
  return (
    <Container>
      <Search onChange={onChangeSearch} />
      <HorizontalDivider style={{ marginBottom: "8px" }} />
      <NoFoundIssues issues={issues}>
        {(issues) => issues.map((issue) => (
          <Fragment key={issue.id}>
            <IssueItem issue={issue} onClickTitle={() => onNavigateToIssue(issue.key)}/>
            <HorizontalDivider style={{ marginBottom: 6 }} />
          </Fragment>
        ))}
      </NoFoundIssues>
    </Container>
  );
};

export { Home };
