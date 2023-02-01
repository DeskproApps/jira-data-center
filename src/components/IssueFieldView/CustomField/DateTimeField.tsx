import type { FC } from "react";
import type { MappedViewProps } from "../types";
import { NoValue } from "../NoValue";

export const DateTimeField: FC<MappedViewProps> = ({ value }) => {
    return value
        ? <>{new Date(value as string).toLocaleDateString()} {new Date(value as string).toLocaleTimeString()}</>
        : <NoValue />
};
