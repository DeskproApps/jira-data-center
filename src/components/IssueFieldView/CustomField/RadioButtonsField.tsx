import type { FC } from "react";
import type { MappedViewProps } from "../types";
import get from "lodash/get";
import { NoValue } from "../NoValue";

export const RadioButtonsField: FC<MappedViewProps> = ({ value }) => {
    return get(value, ["value"]) ? get(value, ["value"]) : <NoValue />
};
