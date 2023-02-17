import { useCallback } from "react";
import get from "lodash/get";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { TicketContext } from "../types";

type UseExternalLink = () => {
    getBaseUrl: () => string,
};

const useExternalLink: UseExternalLink = () => {
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const instanceUrl = get(context, ["settings", "instance_url"]);

    const getBaseUrl = useCallback(() => {
        return !instanceUrl ? "#" : instanceUrl;
    }, [instanceUrl]);
    return { getBaseUrl };
};

export { useExternalLink };
