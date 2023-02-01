import type { FC } from "react";
import type { MappedViewProps } from "../types";
import get from "lodash/get";
import { NoValue } from "../NoValue";

export const SelectSingleField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    return get(value, ["value"]) ? get(value, ["value"]) : <NoValue />
};
