import { useMemo, useState } from "react";
import {
  faCaretDown,
  faHandPointer,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "use-debounce";
import { Dropdown, DivAsInputWithDisplay } from "@deskpro/deskpro-ui";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { searchUsers } from "../../../services/jira";
import { QueryKey } from "../../../query";
import { loadingOption, getNotFoundOption } from "../../../utils";
import { optionsRenderer } from "./utils";
import type { FC } from "react";
import type { FieldHelperProps } from "formik";
import type { AnyIcon, DropdownTargetProps } from "@deskpro/deskpro-ui";
import type { JiraUser } from "../../../services/jira/types";

export type Props = {
  id: string;
  helpers: FieldHelperProps<JiraUser["name"]>;
  value?: JiraUser["name"];
};

const UserSelect: FC<Props> = ({ helpers, id, value }) => {
  const [input, setInput] = useState<string|null>(null);
  const [search] = useDebounce(input, 500);

  const users = useQueryWithClient(
    [QueryKey.USERS, `${search === null ? value : search}`],
    (client) => searchUsers(client, `${search === null ? value : search}`),
  );

  const selectedUser = (users.data ?? []).find((u) => u.name === value);

  const options = useMemo(() => {
    const orderedUsers = (users.data || []).sort((a, b) => {
      return a.displayName > b.displayName ? 1 : -1;
    });

    return (search === null) // if haven't searched anyone yet
      ? [getNotFoundOption("No user(s) found")]
      : (users.isFetching) // if sent searching request in the API
      ? [loadingOption]
      : (orderedUsers.length === 0) // if nothing found
      ? [getNotFoundOption("No user(s) found")]
      : orderedUsers.map((user) => ({
          value: user.name,
          label: <>{user.displayName}</>,
          key: user.name,
          type: "value" as const,
        }));
  }, [users.data, users.isFetching, search]);

  return (
    <Dropdown
      showInternalSearch
      options={options}
      inputValue={input || ""}
      onInputChange={setInput}
      onSelectOption={(option) => {
        helpers.setTouched(true);
        helpers.setValue(option.value);
      }}
      fetchMoreText="Fetch more"
      autoscrollText="Autoscroll"
      selectedIcon={faHandPointer as AnyIcon}
      externalLinkIcon={faExternalLinkAlt as AnyIcon}
      optionsRenderer={optionsRenderer}
      hideIcons
    >
      {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => (
        <DivAsInputWithDisplay
          id={id}
          placeholder="Select value"
          value={selectedUser?.displayName || selectedUser?.emailAddress || selectedUser?.name}
          variant="inline"
          rightIcon={faCaretDown as AnyIcon}
          ref={targetRef}
          {...targetProps}
          isVisibleRightIcon
        />
      )}
    </Dropdown>
  );
};

export { UserSelect };
