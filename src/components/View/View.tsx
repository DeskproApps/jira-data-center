import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "../common";
import {
  Details,
  Comments,
  CustomFields,
} from "./blocks";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type {
  IssueItem,
  JiraComment,
  IssueAttachment,
} from "../../services/jira/types";

type Props = {
  issue: Maybe<IssueItem>,
  attachments?: Maybe<IssueAttachment[]>,
  comments?: Maybe<JiraComment[]>,
  onNavigateToAddComment: () => void,
};

const View: FC<Props> = ({
  issue,
  comments,
  attachments,
  onNavigateToAddComment,
}) => {
  return (
    <>
      <Container>
        <Details
          issue={issue}
          attachments={attachments}
        />
        <CustomFields customFields={issue?.customFields} />
      </Container>

      <HorizontalDivider/>

      <Container>
        <Comments
          comments={comments}
          onNavigateToAddComment={onNavigateToAddComment}
        />
      </Container>
    </>
  );
};

export { View };
