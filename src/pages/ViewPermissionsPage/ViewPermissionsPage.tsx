import { LoadingSpinner } from "@deskpro/app-sdk";
import { useSetAppTitle, useRegisterElements } from "../../hooks";
import { usePermissions } from "./hooks";
import { ViewPermissions } from "../../components";
import type { FC } from "react";

const ViewPermissionsPage: FC = () => {
    const { permissions, isLoading } = usePermissions();

    useSetAppTitle("JIRA Permissions");

    useRegisterElements(({ registerElement }) => {
      registerElement("refresh", { type: "refresh_button" });
      registerElement("home", {
        type: "home_button",
        payload: { type: "changePage", path: "/home" },
      });
    });

    if (isLoading) {
        return (<LoadingSpinner />);
    }

    return (
      <ViewPermissions permissions={permissions} />
    );
};

export { ViewPermissionsPage };
