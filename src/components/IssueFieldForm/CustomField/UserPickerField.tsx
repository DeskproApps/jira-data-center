import { FC } from "react";
import { DropdownValueType, Label } from "@deskpro/deskpro-ui";
import { MappedFieldProps } from "../types";
import { DropdownSelect } from "../../common";
import { FieldType } from "../../../types";
import { useStore } from "../../../context/StoreProvider/hooks";
import { JiraUserInfo } from "../../../services/jira/types";

export const UserPickerField: FC<MappedFieldProps> = ({ id, meta, field, error, helpers }: MappedFieldProps) => {
    const [ state ] = useStore();

    if (meta.type !== FieldType.USER_PICKER) {
        return (<></>);
    }

    if (!state?.dataDependencies?.users) {
        return (<></>);
    }

    const users: JiraUserInfo[] = (state.dataDependencies.users ?? [])
        .filter((user) => user.active && user.accountType === "atlassian")
    ;

    return (
        <Label
            htmlFor={id}
            label={meta.name}
            error={error}
        >
            <DropdownSelect
                helpers={helpers}
                options={users.map((user, idx: number) => ({
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
