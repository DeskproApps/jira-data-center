import { isNaN, isNumber } from "lodash";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const NumberField: FC<MappedViewProps> = ({ value }) => {
    const numberValue = Number(value);

    return (isNumber(numberValue) && !isNaN(numberValue))
        ? <>{value}</>
        : <NoValue />
};
