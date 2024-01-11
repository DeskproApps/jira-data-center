import { useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";

export const NoValue: FC = () => {
    const { theme } = useDeskproAppTheme();

    return (
      <span style={{ color: theme.colors.grey40 }}>None</span>
    );
};
