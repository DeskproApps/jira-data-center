import { useState, useEffect } from "react";
import get from "lodash/get";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { TicketContext } from "../types";

type UseCheckingCorrectlySettings = () => {
    isSettingsError: boolean,
};

const useCheckingCorrectlySettings: UseCheckingCorrectlySettings = () => {
    const [isSettingsError, setIsSettingsError] = useState<boolean>(false);

    const [state] = useStore();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const instanceUrl = get(context, ["settings", "instance_url"]);
    const page = get(state, ["page"]);

    useEffect(() => {
        if (page === "verify_settings") {
            return;
        }

        if (context?.settings && !instanceUrl) {
            setIsSettingsError(true);
        }
    }, [context, page, instanceUrl]);

    return { isSettingsError };
};

export { useCheckingCorrectlySettings };
