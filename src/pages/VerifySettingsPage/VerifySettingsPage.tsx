import { useState, useCallback } from "react";
import every from "lodash/every";
import { P1, Stack, Button } from "@deskpro/deskpro-ui";
import {
    IDeskproClient,
    useDeskproAppClient,
    useDeskproAppEvents,
    adminGenericProxyFetch,
} from "@deskpro/app-sdk";
import { Invalid, Secondary } from "../../components/common";
import type { FC } from "react";
import type { JiraUser } from "../../services/jira/types";
import type { Settings } from "../../types";

const preInstalledRequest = async (
    client: IDeskproClient,
    settings: Required<Pick<Settings, "instance_url"|"api_key">>,
): Promise<JiraUser|null> => {
    const { instance_url, api_key } = settings;

    const dpFetch = await adminGenericProxyFetch(client);

    const res = await dpFetch(`${instance_url}/rest/api/2/myself`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${api_key}`,
        },
    });

    if (res.status !== 200) {
        throw new Error(`Request failed: [${res.status}] ${await res.text()}`);
    }

    try {
        return await res.json();
    } catch (e) {
        return null;
    }
};

const VerifySettingsPage: FC = () => {
    const { client } = useDeskproAppClient();
    const [currentUser, setCurrentUser] = useState<JiraUser|null>(null);
    const [settings, setSettings] = useState<Settings>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const errorMessage = "Failed to connect to Jira, settings seem to be invalid";

    useDeskproAppEvents({
        onAdminSettingsChange: setSettings,
    }, [client]);

    const onVerifySettings = useCallback(() => {
        if (!client || !settings?.instance_url || !settings?.api_key) {
            return;
        }

        setIsLoading(true);
        setError("");
        setCurrentUser(null);

        return preInstalledRequest(client, {
            instance_url: settings.instance_url,
            api_key: settings.api_key,
        })
            .then(setCurrentUser)
            .catch(() => setError(errorMessage))
            .finally(() => setIsLoading(false))
    }, [client, settings, errorMessage]);

    return (
        <Stack align="baseline" >
            <Button
                text="Verify Settings"
                intent="secondary"
                style={{ minWidth: "72px", justifyContent: "center" }}
                onClick={onVerifySettings}
                loading={isLoading}
                disabled={!every([settings?.instance_url, settings?.api_key] || isLoading)}
            />&nbsp;

            {currentUser
                ? (
                    <P1 style={{ marginBottom: "6px" }}>
                        Verified as <Secondary type="p1">
                            {currentUser.displayName} {`<${currentUser.emailAddress}>`}
                        </Secondary>
                    </P1>
                )
                : <Invalid type="p1">{error}</Invalid> || ""
            }
        </Stack>
    );
};

export { VerifySettingsPage };
