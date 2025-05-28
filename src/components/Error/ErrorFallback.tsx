import { match } from "ts-pattern";
import { Stack } from "@deskpro/deskpro-ui";
import { DEFAULT_ERROR, SETTINGS_ERROR, STATUS } from "../../constants";
import { JiraError } from "../../services/jira";
import { getApiError } from "../../utils";
import { Container, ErrorBlock } from "../common";
import { FallbackRender } from "@sentry/react";

const ErrorFallback: FallbackRender = ({ error }) => {
  let message = DEFAULT_ERROR;
  let consoleMsg = null;

  if (error instanceof JiraError) {
    message = match(error.status)
      .with(STATUS.Forbidden, () => SETTINGS_ERROR)
      .with(STATUS.Unauthorized, () => SETTINGS_ERROR)
      .otherwise(() => DEFAULT_ERROR);

    consoleMsg = getApiError(error);
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
