import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const DateField: FC<MappedViewProps> = ({ value }) => (value
    ? <>{new Date(value as string).toLocaleDateString()}</>
    : <NoValue />
);
