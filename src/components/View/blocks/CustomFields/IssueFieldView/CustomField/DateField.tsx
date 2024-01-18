import { P5 } from "@deskpro/deskpro-ui";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const DateField: FC<MappedViewProps> = ({ value }) => (value
    ? <P5>{new Date(value as string).toLocaleDateString()}</P5>
    : <NoValue />
);
