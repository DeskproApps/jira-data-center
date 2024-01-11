import { FC } from "react";
import { useWhenNoLinkedItems } from "../hooks";
import { LoadingSpinner } from "@deskpro/app-sdk";

const LoadingApp: FC = () => {
  useWhenNoLinkedItems();

  return (
    <LoadingSpinner/>
  );
};

export { LoadingApp };
