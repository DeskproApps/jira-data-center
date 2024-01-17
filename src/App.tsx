import { get, noop } from "lodash";
import { match } from "ts-pattern";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { isNavigatePayload } from "./utils";
import {
  useUnlinkIssue,
  useRegisterElements,
  useCheckingCorrectlySettings,
} from "./hooks";
import { SettingsError } from "./components/common";
import {
  EditPage,
  HomePage,
  LinkPage,
  ViewPage,
  CreatePage,
  LoadingAppPage,
  VerifySettingsPage,
  ViewPermissionsPage,
  CreateIssueCommentPage,
} from "./pages";
import type { ElementEventPayload } from "./types";

const App = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { isSettingsError } = useCheckingCorrectlySettings();
  const { unlink, isLoading } = useUnlinkIssue();

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
  });

  useDeskproAppEvents({
    onShow: () => {
      client && setTimeout(() => client.resize(), 200);
    },
    onElementEvent: (_, __, payload) => {
      match<ElementEventPayload>(payload as ElementEventPayload)
        .with({ type: "changePage" }, () => {
          if (isNavigatePayload(payload as ElementEventPayload)) {
            navigate(get(payload, ["path"]));
          }
        })
        .with({ type: "unlink" }, () => unlink(get(payload, ["issueKey"])))
        .otherwise(noop)
      ;
    },
  }, [client, context]);

  if (!client || isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <>
      {isSettingsError && (<SettingsError />)}
      <Routes>
        <Route path="/admin/verify_settings" element={<VerifySettingsPage />}/>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/link" element={<LinkPage />}/>
        <Route path="/view/:issueKey" element={<ViewPage />}/>
        <Route path="/create" element={<CreatePage />}/>
        <Route path="/edit/:issueKey" element={<EditPage />}/>
        <Route path="/comment/:issueKey" element={<CreateIssueCommentPage />}/>
        <Route path="/view_permissions" element={<ViewPermissionsPage />}/>
        <Route index  element={<LoadingAppPage />}/>
      </Routes>
    </>
  );
}

export { App };
