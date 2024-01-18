import { Label, Radio } from "@deskpro/deskpro-ui";
import { FieldType } from "../../../../types";
import type { MappedFieldProps } from "../types";
import type { FC } from "react";

export const RadioButtonsField: FC<MappedFieldProps> = ({ id, meta, field, error, helpers }: MappedFieldProps) => {
    if (meta.type !== FieldType.RADIO_BUTTONS) {
        return (<></>);
    }

    const allowedValues = meta?.allowedValues ?? [];

    return (
        <Label
            htmlFor={id}
            label={<div style={{ marginBottom: "3px" }}>{meta.name}</div>}
            error={error}
        >
            {allowedValues.map((allowedValue, idx: number) => (
                <Radio
                    key={idx}
                    label={allowedValue.value}
                    value={allowedValue.id}
                    checked={allowedValue.id === field.value}
                    id={allowedValue.id}
                    onChange={() => helpers.setValue(allowedValue.id)}
                />
            ))}
        </Label>
    );
};
