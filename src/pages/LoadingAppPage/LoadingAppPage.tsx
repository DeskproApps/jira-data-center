import { LoadingSpinner } from "@deskpro/app-sdk";
import { useWhenNoLinkedItems } from "../../hooks";
import type { FC } from "react";

const LoadingAppPage: FC = () => {
  useWhenNoLinkedItems();

  return (
    <LoadingSpinner/>
  );
};

export { LoadingAppPage };
