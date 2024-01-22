import get from "lodash/get";
import { P5 } from "@deskpro/deskpro-ui";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const RequestLanguageField: FC<MappedViewProps> = ({ value }) => {
    return get(value, ["displayName"])
        ? <P5>{get(value, ["displayName"])}</P5>
        : <NoValue />;
}
