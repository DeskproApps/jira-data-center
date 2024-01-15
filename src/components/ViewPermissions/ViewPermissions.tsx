import { faCheckCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { P5, Stack } from "@deskpro/deskpro-ui";
import {
  Link,
  Property,
  HorizontalDivider,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { Container } from "../common";
import type { FC } from "react";
import type { Permission } from "../../services/jira/types";

type Props = {
  permissions: Permission[],
};

const ViewPermissions: FC<Props> = ({ permissions }) => {
  const { theme } = useDeskproAppTheme();

  return (
    <>
      <Container>
        <P5 style={{fontSize: "12px"}}>
          Below is a list of your user <Link target="_blank" href="https://support.atlassian.com/jira-work-management/docs/how-do-jira-permissions-work/">permissions</Link>.
          The Deskpro JIRA app requires all these permissions to be granted to your user.
        </P5>
      </Container>

      <HorizontalDivider style={{ marginBottom: "15px" }} />

      <Container>

        <Stack vertical gap={14}>
          {permissions.map((permission, idx) => (
            <div style={{ width: "100%" }} key={idx}>
              <Stack justify="space-between" align="center" style={{ width: "100%", marginBottom: "10px" }} gap={10}>
                <Property
                  label={permission.name}
                  text={permission.description}
                />
                {permission.havePermission ? (
                  <FontAwesomeIcon
                    icon={faCheckCircle as { prefix: "fas"; iconName: "mailchimp" }}
                    color={theme.colors.green100}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faTimesCircle as { prefix: "fas"; iconName: "mailchimp" }}
                    color={theme.colors.red100}
                  />
                )}
              </Stack>
              <HorizontalDivider />
            </div>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export {ViewPermissions};
