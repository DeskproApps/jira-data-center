import { Search, HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "../common";
import { Buttons, Issues } from "./blocks";
import type { FC } from "react";
import type { IssueItem as IssueItemType } from "../../services/jira/types";

type Props = {
  isFetching?: boolean,
  onChangeSearch: (q: string) => void,
  isSubmitting: boolean,
  onCancel: () => void,
  onLinkIssues: () => void,
  issues?: IssueItemType[],
  selectedIssueIds: Array<IssueItemType["key"]>,
  onChangeSelectedIssue: (issueKey: IssueItemType["key"]) => void,
};

const Link: FC<Props> = ({
  isFetching,
  isSubmitting,
  onChangeSearch,
  onLinkIssues,
  onCancel,
  issues,
  selectedIssueIds,
  onChangeSelectedIssue,

}) => {
  return (
    <>
      <Container>
        <Search
          isFetching={isFetching}
          onChange={onChangeSearch}
        />
        <Buttons
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          onLinkIssues={onLinkIssues}
          selectedIssues={selectedIssueIds}
        />
      </Container>

      <HorizontalDivider style={{ marginTop: "8px", marginBottom: "8px" }} />

      <Container>
        <Issues
          isLoading={isFetching}
          issues={issues}
          selectedIssueIds={selectedIssueIds}
          onChangeSelectedIssue={onChangeSelectedIssue}
        />
      </Container>
    </>
  );
};

export { Link };
