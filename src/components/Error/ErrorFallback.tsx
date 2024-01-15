import get from "lodash/get";
import { Stack } from "@deskpro/deskpro-ui";
import { DEFAULT_ERROR } from "../../constants";
import { JiraError } from "../../services/jira";
import { Container, ErrorBlock } from "../common";
import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";

type Props = Omit<FallbackProps, "error"> & {
  error: Error,
};

const ErrorFallback: FC<Props> = ({ error }) => {
  const message = DEFAULT_ERROR;
  let consoleMsg = null;

  if (error instanceof JiraError) {
    consoleMsg = get(error, ["data", "message"])
      || get(error, ["data", "errorMessages", 0]);
  }

  // eslint-disable-next-line no-console
  console.error(consoleMsg || error);

  return (
    <Container>
      <ErrorBlock
        text={(
          <Stack gap={6} vertical style={{ padding: "8px" }}>
            {message}
          </Stack>
        )}
      />
    </Container>
  );
};

export { ErrorFallback };
