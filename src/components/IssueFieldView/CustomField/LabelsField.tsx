import type { FC } from "react";
import type { MappedViewProps } from "../types";
import { NoValue } from "../NoValue";
import { Pill, Stack } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";

export const LabelsField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    const { theme } = useDeskproAppTheme();

    const labels = (value ?? []);

    if (!Array.isArray(labels) || !labels.length) {
        return (<NoValue />);
    }

    return (
        <Stack gap={3}>
            {labels.map((option, idx) => (
                <Pill
                    key={idx}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={option as any}
                    textColor={theme.colors.grey100}
                    backgroundColor={theme.colors.grey10}
                />
            ))}
        </Stack>
    );
};
