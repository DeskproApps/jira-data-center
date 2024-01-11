import isString from "lodash/isString";
import { Link, LinkIcon } from "@deskpro/app-sdk";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const UrlField: FC<MappedViewProps> = ({ value }: MappedViewProps) => {
    if (!isString(value)) {
        return (<NoValue />);
    }

    return (
        <>
            <Link href={value} target="_blank">{value}</Link>
            <LinkIcon href={value} />
        </>
    );
};
