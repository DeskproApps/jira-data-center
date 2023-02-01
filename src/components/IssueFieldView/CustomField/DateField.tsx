import type { FC } from "react";
import type { MappedViewProps } from "../types";
import { NoValue } from "../NoValue";

export const DateField: FC<MappedViewProps> = ({ value }) => (value
    ? <>{new Date(value as string).toLocaleDateString()}</>
    : <NoValue />
);
