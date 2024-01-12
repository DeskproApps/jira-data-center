import { Fragment } from "react";
import { Search, HorizontalDivider } from "@deskpro/app-sdk";
import { Container, ErrorBlock, NoFoundIssues } from "../common";
import { IssueItem } from "../IssueItem";
import type { FC } from "react";
import type { IssueItem as IssueItemType } from "../../context/StoreProvider/types";


type Props = {
  issues: IssueItemType[],
  onChangeSearch: (q: string) => void,
  onNavigateToIssue: (issueKey: IssueItemType["key"]) => void,
  isError: boolean,
};

const Home: FC<Props> = ({
  issues,
  isError,
  onChangeSearch,
  onNavigateToIssue,
}) => {
  return (
    <Container>
      {isError && (
        <ErrorBlock text="You cannot create issue type via this app, please visit JIRA" />
      )}
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
