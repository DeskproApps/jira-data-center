import uniq from "lodash/uniq";
import { Label } from "@deskpro/deskpro-ui";
import { useFormDeps } from "../../hooks";
import { DropdownMultiSelect } from "../../../common";
import type { FC } from "react";
import type { DropdownMultiSelectValueType } from "../../../common/DropdownMultiSelect";
import type { MappedFieldProps } from "../types";

export const LabelsField: FC<MappedFieldProps> = ({ id, meta, field, error, helpers, extraLabels }: MappedFieldProps) => {
    const { labels } = useFormDeps();

    if (!labels) {
        return (<></>);
    }

    const allLabels = [
        ...labels ?? [],
        ...extraLabels ?? []
    ];

    return (
        <Label
            htmlFor={id}
            label={meta.name}
            error={error}
        >
            <DropdownMultiSelect
                helpers={helpers}
                options={uniq(allLabels).map((label: string, idx: number) => ({
                    label,
                    key: `${idx}`,
                    valueLabel: label,
                    value: label,
                    type: "value" as const,
                } as DropdownMultiSelectValueType))}
                id={id}
                placeholder="Select values"
                values={field.value}
            />
        </Label>
    );
};
