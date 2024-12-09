import startCase from "lodash/startCase";
import { Stack, Spinner } from "@deskpro/deskpro-ui";
import { NOT_FOUND } from "../constants";
import type { DropdownValueType, DropdownHeaderType } from "@deskpro/deskpro-ui";
import type { Option } from "../types";

const getOption = <Value,>(
  value: Value,
  label?: DropdownValueType<Value>["label"],
  description?: DropdownValueType<Value>["description"],
): Option<Value> => ({
  value,
  label: label || `${startCase(value as string)}`,
  key: `${value}`,
  type: "value",
  ...(description ? { description } : {}),
});

const getNotFoundOption = (label = NOT_FOUND): DropdownHeaderType => ({
  type: "header", label,
});

const loadingOption: DropdownHeaderType = {
  type: "header",
  label: (
    <Stack vertical align="center">
      <Spinner size="extra-small"/>
    </Stack>
  ),
};

export { getOption, getNotFoundOption, loadingOption };
