import { Container } from "../common";
import { IssueForm } from "../IssueForm";
import type { FC } from "react";
import type { IssueFormProps } from "../IssueForm";

type Props = Omit<IssueFormProps, "type">;

const Edit: FC<Props> = (props) => {
  return (
    <Container>
      <IssueForm type="update" {...props} />
    </Container>
  );
};

export { Edit };
