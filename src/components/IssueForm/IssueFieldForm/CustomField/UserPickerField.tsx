import { size } from "lodash";
import { Label } from "@deskpro/deskpro-ui";
import { DropdownSelect } from "../../../common";
import { FieldType } from "../../../../types";
import { useFormDeps } from "../../hooks";
import type { FC } from "react";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { JiraUserInfo } from "../../../../services/jira/types";
import type { MappedFieldProps } from "../types";

export const UserPickerField: FC<MappedFieldProps> = ({ id, meta, field, error, helpers }: MappedFieldProps) => {
    const { users } = useFormDeps();

    if (meta.type !== FieldType.USER_PICKER) {
        return (<></>);
    }

    if (!size(users)) {
        return (<></>);
    }

    const filteredUsers: JiraUserInfo[] = (Array.isArray(users) ? users : [])
        .filter((user) => user.active && user.accountType === "atlassian");

    return (
        <Label
            htmlFor={id}
            label={meta.name}
            error={error}
        >
            <DropdownSelect
                helpers={helpers}
                options={filteredUsers.map((user, idx: number) => ({
                    key: `${idx}`,
                    label: user.displayName,
                    value: user.accountId,
                    type: "value" as const
                } as DropdownValueType<JiraUserInfo["accountId"]>))}
                id={id}
                placeholder="Select value"
                value={field.value}
            />
        </Label>
    );
};
