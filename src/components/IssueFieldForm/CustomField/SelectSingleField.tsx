import { FC } from "react";
import { DropdownValueType, Label } from "@deskpro/deskpro-ui";
import { MappedFieldProps } from "../types";
import { DropdownSelect } from "../../common";
import { FieldType } from "../../../types";

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
