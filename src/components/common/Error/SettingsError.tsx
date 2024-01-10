import { FC } from "react";
import { ErrorBlock } from "./ErrorBlock";

const SettingsError: FC = () => (
    <ErrorBlock text="Please check that your settings for this app in admin are correct" />
);

export { SettingsError };
