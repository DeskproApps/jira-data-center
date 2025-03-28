import { useState } from "react";
import {
  faCaretDown,
  faHandPointer,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DivAsInputWithDisplay } from "@deskpro/deskpro-ui";
import { optionsRenderer } from "./utils";
import type { FC } from "react";
import type { FieldHelperProps } from "formik";
import type {
  AnyIcon,
  DropdownValueType,
  DropdownTargetProps,
} from "@deskpro/deskpro-ui";

export interface DropdownSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  helpers: FieldHelperProps<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: DropdownValueType<any>[];
  id?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  disabled?: boolean;
  containerMaxHeight?: number;
}

const DropdownSelect: FC<DropdownSelectProps> = ({ helpers, id, placeholder, value, options, ...props }: DropdownSelectProps) => {
  const [input, setInput] = useState<string>("");

  const selectedValue = options
    .filter((o) => o.value === value)[0]
    ?.label ?? ""
  ;

  const filteredOptions = options.filter(
      (opt) => (opt.label as string).toLowerCase().includes(input.toLowerCase())
  );

  return (
    <Dropdown
      {...props}
      showInternalSearch
      options={filteredOptions}
      inputValue={input}
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
          placeholder={placeholder}
          value={selectedValue}
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

export { DropdownSelect };
