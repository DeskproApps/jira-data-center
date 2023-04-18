import { FC, Ref } from "react";
import { MappedFieldProps } from "../types";
import { getDateFromValue } from "../../../utils";
import { AnyIcon, DateTimePicker, Input, Label } from "@deskpro/app-sdk";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export const DateTimeField: FC<MappedFieldProps> = ({ id, meta, field, helpers, error }: MappedFieldProps) => (
    <DateTimePicker
        onChange={(dates: Date[]) => {
            helpers.setValue(dates[0]);
            helpers.setTouched(true);
        }}
        value={field.value && getDateFromValue(field.value)}
        render={(_: unknown, ref: Ref<HTMLInputElement>) => (
            <Label
                htmlFor={id}
                label={meta.name}
                error={error}
                placeholder="Select date/time"
            >
                <Input id={id} inputsize="small" variant="inline" rightIcon={faCalendarAlt as AnyIcon} ref={ref} style={{ maxWidth: "244px" }} />
            </Label>
        )}
    />
);
