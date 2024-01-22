import { useMemo, useState, useEffect } from "react";
import get from "lodash/get";
import { useLocation } from "react-router-dom";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { TicketContext } from "../types";

type UseCheckingCorrectlySettings = () => {
    isSettingsError: boolean,
};

const useCheckingCorrectlySettings: UseCheckingCorrectlySettings = () => {
  const { pathname } = useLocation();
  const [isSettingsError, setIsSettingsError] = useState<boolean>(false);
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const instanceUrl = useMemo(() => get(context, ["settings", "instance_url"]), [context]);
  const isAdmin = useMemo(() => pathname.includes("/admin/"), [pathname]);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    if (context?.settings && !instanceUrl) {
      setIsSettingsError(true);
    }
  }, [context, instanceUrl, isAdmin]);

  return { isSettingsError };
};

export { useCheckingCorrectlySettings };
