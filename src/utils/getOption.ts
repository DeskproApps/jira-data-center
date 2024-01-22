import startCase from "lodash/startCase";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Option } from "../types";

const getOption = <Value>(
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

export { getOption };
