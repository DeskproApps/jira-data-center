import isString from "lodash/isString";
import { P5 } from "@deskpro/deskpro-ui";
import { Link, LinkIcon } from "@deskpro/app-sdk";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const UrlField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    if (!isString(value)) {
        return (<NoValue />);
    }

    return (
        <P5>
            <Link href={value} target="_blank">{value}</Link>
            <LinkIcon href={value} />
        </P5>
    );
};
