import { useState } from "react";
import { orderBy } from "lodash";
import {
    LoadingSpinner,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getMyPermissions } from "../../services/jira";
import { useSetAppTitle, useRegisterElements } from "../../hooks";
import { ViewPermissions } from "../../components";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { Permissions } from "../../services/jira/types";

const ViewPermissionsPage: FC = () => {
    const [permissionStatuses, setPermissionStatuses] = useState<Maybe<{ permissions: Permissions }>>(null);

    useSetAppTitle("JIRA Permissions");

    useInitialisedDeskproAppClient((client) => {
        getMyPermissions(client)
            .then(setPermissionStatuses)
            .then(() => setTimeout(() => client.resize(), 500));
    });

    useRegisterElements(({ registerElement }) => {
      registerElement("refresh", { type: "refresh_button" });
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
      <ViewPermissions permissions={permissions} />
    );
};

export { ViewPermissionsPage };
