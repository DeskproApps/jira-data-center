import type { FC } from "react";
import type { MappedViewProps } from "../types";
import get from "lodash/get";
import { NoValue } from "../NoValue";

export const RequestLanguageField: FC<MappedViewProps> = ({ value }) => {
    return get(value, ["displayName"])
        ? <>{get(value, ["displayName"])}</>
        : <NoValue />;
}
