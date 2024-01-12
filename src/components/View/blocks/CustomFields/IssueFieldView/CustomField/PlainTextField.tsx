import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const PlainTextField: FC<MappedViewProps> = ({ value }: MappedViewProps) => (value
    ? <>{value}</>
    : <NoValue />
);
