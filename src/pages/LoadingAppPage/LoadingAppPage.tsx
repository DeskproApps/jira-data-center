import { LoadingSpinner } from "@deskpro/app-sdk";
import { useLoadingApp } from "./hooks";
import type { FC } from "react";

const LoadingAppPage: FC = () => {
  useLoadingApp();

  return (
    <LoadingSpinner/>
  );
};

export { LoadingAppPage };
