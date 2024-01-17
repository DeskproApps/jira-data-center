import { Container, Navigation } from "../common";
import { IssueForm } from "../IssueForm/IssueForm";
import type { FC } from "react";
import type { FormikHelpers } from "formik";
import type { IssueFormData } from "../../services/jira/types";
import type { IssueMeta } from "../../types";
import type { SubmitIssueFormData } from "../IssueForm/types";

type Props = {
  onSubmit: (
    values: SubmitIssueFormData,
    formikHelpers: FormikHelpers<IssueFormData>,
    meta: Record<string, IssueMeta>,
  ) => void | Promise<void>;
  loading: boolean,
  apiErrors: Record<string, string>,
  onNavigateToLink: () => void,
};

const CreateIssue: FC<Props> = ({ onNavigateToLink, ...props }) => {
  return (
    <Container>
      <Navigation onNavigateToLink={onNavigateToLink} />
      <IssueForm type="create" {...props} />
    </Container>
  );
};

export { CreateIssue };
