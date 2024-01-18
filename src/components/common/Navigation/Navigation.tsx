import noop from "lodash/noop";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { TwoButtonGroupProps } from "@deskpro/app-sdk";

type Props = {
  onNavigateToLink?: TwoButtonGroupProps["twoOnClick"],
  onNavigateToCreate?: TwoButtonGroupProps["oneOnClick"],
};

const Navigation: FC<Props> = ({ onNavigateToLink, onNavigateToCreate }) => (
  <TwoButtonGroup
    selected={onNavigateToCreate ? "one" : "two"}
    oneLabel="Find Issue"
    twoLabel="Create Issue"
    oneIcon={faSearch}
    twoIcon={faPlus}
    oneOnClick={onNavigateToLink || noop}
    twoOnClick={onNavigateToCreate || noop}
  />
);

export { Navigation };
