import { Label } from "@deskpro/deskpro-ui";
import { DateInput } from "@deskpro/app-sdk";
import { getDateFromValue } from "../../../../utils";
import type { FC } from "react";
import type { MappedFieldProps } from "../types";

export const DateField: FC<MappedFieldProps> = ({ id, meta, field, helpers, error }: MappedFieldProps) => (
    <Label
        htmlFor={id}
        error={error}
        label={meta.name}
    >
        <DateInput
            id={id}
            error={error}
            value={field.value && getDateFromValue(field.value)}
            onChange={(dates: Date[]) => {
                helpers.setValue(dates[0]);
                helpers.setTouched(true);
            }}
        />
    </Label>
);
