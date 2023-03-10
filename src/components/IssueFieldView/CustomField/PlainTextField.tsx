import type { FC } from "react";
import type { MappedViewProps } from "../types";
import { NoValue } from "../NoValue";

export const PlainTextField: FC<MappedViewProps> = ({ value }: MappedViewProps) => (value
    ? <>{value}</>
    : <NoValue />
);
