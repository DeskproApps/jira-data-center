import { Label } from "@deskpro/deskpro-ui";
import { DropdownSelect } from "../../../common";
import { FieldType } from "../../../../types";
import type { FC } from "react";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { MappedFieldProps } from "../types";

export const SelectSingleField: FC<MappedFieldProps> = ({ id, meta, field, error, helpers }: MappedFieldProps) => {
    if (meta.type !== FieldType.SELECT_SINGLE) {
        return (<></>);
    }

    const options = meta?.allowedValues ?? [];

    return (
        <Label
            htmlFor={id}
            label={meta.name}
            error={error}
        >
            <DropdownSelect
                helpers={helpers}
                options={options.map((option, idx) => ({
                    key: `${idx}`,
                    label: option.value,
                    value: option.id,
                    type: "value" as const
                } as DropdownValueType<unknown>))}
                id={id}
                placeholder="Select value"
                value={field.value}
            />
        </Label>
    );
};
