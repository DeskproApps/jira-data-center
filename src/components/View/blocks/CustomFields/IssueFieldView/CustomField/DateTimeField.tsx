import { P5 } from "@deskpro/deskpro-ui";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const DateTimeField: FC<MappedViewProps> = ({ value }) => {
    return value
        ? <P5>{new Date(value as string).toLocaleDateString()} {new Date(value as string).toLocaleTimeString()}</P5>
        : <NoValue />
};
