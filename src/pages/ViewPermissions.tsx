import {useState} from "react";
import { Stack } from "@deskpro/deskpro-ui";
import {
    useInitialisedDeskproAppClient,
    LoadingSpinner,
    Property,
    useDeskproAppTheme,
    HorizontalDivider
} from "@deskpro/app-sdk";
import {getMyPermissions} from "../context/StoreProvider/api";
import { Permissions } from "../context/StoreProvider/types";
import {orderBy} from "lodash";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useSetAppTitle, useRegisterElements } from "../hooks";

export const  ViewPermissions = () => {
    const { theme } = useDeskproAppTheme();
    const [ permissionStatuses, setPermissionStatuses ] = useState<null|{ permissions: Permissions }>(null);

    useSetAppTitle("JIRA Permissions");

    useInitialisedDeskproAppClient((client) => {
        getMyPermissions(client)
            .then(setPermissionStatuses)
            .then(() => setTimeout(() => client.resize(), 500));
    });

    useRegisterElements(({ registerElement }) => {
      registerElement("home", {
        type: "home_button",
        payload: { type: "changePage", path: "/home" },
      });
    });

    if (permissionStatuses === null) {
        return (<LoadingSpinner />);
    }

    if (!permissionStatuses?.permissions) {
        return (<span>[Permissions Not Found]</span>);
    }

    const permissions = orderBy(Object.values(permissionStatuses.permissions), "id", "asc");

    return (
        <>
            <p style={{ fontSize: "12px" }}>
                Below is a list of your user <a href="https://support.atlassian.com/jira-work-management/docs/how-do-jira-permissions-work/" target="_blank" style={{ color: theme.colors.cyan100 }}>permissions</a>.
                The Deskpro JIRA app requires all these permissions to be granted to your user.
            </p>
            <HorizontalDivider style={{ marginBottom: "15px" }} />
            <Stack vertical gap={14}>
                {permissions.map((permission, idx) => (
                    <div style={{ width: "100%" }} key={idx}>
                        <Stack justify="space-between" align="center" style={{ width: "100%", marginBottom: "10px" }} gap={10}>
                            <Property
                                label={permission.name}
                                text={permission.description}
                            />
                            {permission.havePermission ? (
                                <FontAwesomeIcon icon={faCheckCircle as {
                                    prefix: "fas";
                                    iconName: "mailchimp";
                                  }} color={theme.colors.green100} />
                            ) : (
                                <FontAwesomeIcon icon={faTimesCircle as {
                                    prefix: "fas";
                                    iconName: "mailchimp";
                                  }} color={theme.colors.red100} />
                            )}
                        </Stack>
                        <HorizontalDivider />
                    </div>
                ))}
            </Stack>
        </>
    );
};
