import size from "lodash/size";
import { Stack, Button } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { IssueItem } from "../../../services/jira/types";

type Props = {
  isSubmitting: boolean,
  selectedIssues: Array<IssueItem["key"]>,
  onCancel: () => void,
  onLinkIssues: () => void,
};

const Buttons: FC<Props> = ({
  onCancel,
  onLinkIssues,
  isSubmitting,
  selectedIssues,
}) => {
  return (
    <Stack justify="space-between">
      <Button
        text="Link Issues"
        disabled={!size(selectedIssues)}
        onClick={onLinkIssues}
        loading={isSubmitting}
      />
      <Button
        text="Cancel"
        intent="secondary"
        onClick={onCancel}
      />
    </Stack>
  );
};

export { Buttons };
