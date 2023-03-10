import type {FC, ReactElement} from "react";
import { IssueMeta, IssueValue } from "../../types";
import { Property } from "@deskpro/app-sdk";
import map from "./map";

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
        <Property title={meta.name}>
            {field as ReactElement}
        </Property>
    );
};
