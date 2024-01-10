import { FC } from "react";
import { Label } from "@deskpro/deskpro-ui";
import { DropdownMultiSelect } from "../../common";
import { FieldType } from "../../../types";
import type { MappedFieldProps } from "../types";
import type { DropdownMultiSelectValueType } from "../../common/DropdownMultiSelect";

export const SelectMultiField: FC<MappedFieldProps> = ({ id, meta, field, error, helpers }: MappedFieldProps) => {
    if (meta.type !== FieldType.SELECT_MULTI) {
        return (<></>);
    }

    const options = meta?.allowedValues ?? [];

    return (
        <Label
            htmlFor={id}
            label={meta.name}
            error={error}
        >
            <DropdownMultiSelect
                helpers={helpers}
                {...field}
                options={options.map((option, idx: number) => ({
                    label: option.value,
                    key: `${idx}`,
                    valueLabel: option.value,
                    value: option.id,
                    type: "value" as const,
                } as DropdownMultiSelectValueType))}
                placeholder="Select values"
                values={field.value}
            />
        </Label>
    );
};
