import { P5 } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";

export const NoValue: FC = () => {
    const { theme } = useDeskproAppTheme();

    return (
      <P5>
        <span style={{ color: theme.colors.grey40 }}>None</span>
      </P5>
    );
};
