import { P5 } from "@deskpro/deskpro-ui";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const PlainTextField: FC<MappedViewProps> = ({ value }: MappedViewProps) => (value
    ? <P5>{value as string}</P5>
    : <NoValue />
);
