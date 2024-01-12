import get from "lodash/get";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const SelectSingleField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    return get(value, ["value"]) ? get(value, ["value"]) : <NoValue />
};
