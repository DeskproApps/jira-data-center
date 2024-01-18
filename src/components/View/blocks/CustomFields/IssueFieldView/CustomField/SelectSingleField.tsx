import get from "lodash/get";
import { P5 } from "@deskpro/deskpro-ui";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const SelectSingleField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    return get(value, ["value"])
      ? <P5>{get(value, ["value"])}</P5>
      : <NoValue />
};
