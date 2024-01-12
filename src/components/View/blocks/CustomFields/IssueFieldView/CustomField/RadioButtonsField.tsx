import get from "lodash/get";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const RadioButtonsField: FC<MappedViewProps> = ({ value }) => {
    return get(value, ["value"]) ? get(value, ["value"]) : <NoValue />
};
