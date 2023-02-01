import type { FC } from "react";
import type { MappedViewProps } from "../types";
import get from "lodash/get";
import { NoValue } from "../NoValue";
import { Pill, Stack, useDeskproAppTheme } from "@deskpro/app-sdk";

export const SelectMultiField: FC<MappedViewProps> = ({ value }) => {
    const { theme } = useDeskproAppTheme();

    const options = (value ?? []);

    if (!Array.isArray(options) || !options.length) {
        return (<NoValue />);
    }

    return (
        <Stack gap={3}>
            {options.map((option, idx) => (
                <Pill
                    key={idx}
                    label={get(option, ["value"])}
                    textColor={theme.colors.grey100}
                    backgroundColor={theme.colors.grey10}
                />
            ))}
        </Stack>
    );
};
