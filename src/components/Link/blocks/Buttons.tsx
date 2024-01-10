import size from "lodash/size";
import { Stack, Button } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { IssueKey } from "../../../types";

type Props = {
  isSubmitting: boolean,
  selectedIssues: IssueKey[],
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
