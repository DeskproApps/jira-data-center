import type { FC } from "react";
import type { MappedViewProps } from "../types";
import isNumber from "lodash/isNumber";
import isNaN from "lodash/isNaN";
import { NoValue } from "../NoValue";

export const NumberField: FC<MappedViewProps> = ({ value }) => {
    const numberValue = Number(value);

    return (isNumber(numberValue) && !isNaN(numberValue))
        ? <>{value}</>
        : <NoValue />
};
