import get from "lodash/get";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const RequestLanguageField: FC<MappedViewProps> = ({ value }) => {
    return get(value, ["displayName"])
        ? <>{get(value, ["displayName"])}</>
        : <NoValue />;
}
