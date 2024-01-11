import map from "./map";
import { Property } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { IssueMeta, IssueValue } from "../../../../../types";

interface IssueFieldViewProps {
    meta: IssueMeta;
    value: IssueValue[IssueMeta["type"]];
}

export const IssueFieldView: FC<IssueFieldViewProps> = ({ value, meta }: IssueFieldViewProps) => {
    const field = map(meta, value);

    if (field === null) {
        // Inform us of the missing map then gracefully do not attempt to render the field
        // eslint-disable-next-line no-console
        console.warn(`Could not render field view, mapping missing for JIRA field type ${meta.type}`);
        return (<></>);
    }

    return (
        <Property
            label={meta.name}
            text={field}
        />
    );
};
