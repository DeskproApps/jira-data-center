import { FieldHelperProps, FieldInputProps } from "formik/dist/types";
import { IssueMeta } from "../../../types";

export interface MappedFieldProps {
    meta: IssueMeta;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: FieldInputProps<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    helpers: FieldHelperProps<any>;
    id: string;
    error: boolean;
    extraLabels?: string[];
}
