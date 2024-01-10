import { FC, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import isEmpty from "lodash/isEmpty";
import values from "lodash/values";
import get from "lodash/get";
import { FieldHelperProps } from "formik";
import {
  Spinner,
  Infinite,
  Dropdown,
  DropdownValueType,
  DropdownHeaderType,
  DropdownTargetProps,
  dropdownRenderOptions,
  DivAsInputWithDisplay,
  AnyIcon,
} from "@deskpro/deskpro-ui";
import {
  useDeskproAppTheme,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  faCaretDown,
  faHandPointer,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { searchIssues } from "../../context/StoreProvider/api";
import { IssueSearchItem, IssueFormData } from "../../context/StoreProvider/types";
import { normalize } from "../../utils";

export interface DropdownWithSearchProps {
  helpers: FieldHelperProps<IssueFormData["parentKey"]>;
  id?: string;
  placeholder?: string;
  value: IssueSearchItem["key"];
  disabled?: boolean;
  projectId: string;
}

const NoFound = () => {
  const { theme } = useDeskproAppTheme();
  return (
      <span style={{ color: theme.colors.grey80 }}>
        No issues found.
      </span>
  );
}

const SearchForParent = () => {
  const { theme } = useDeskproAppTheme();
  return (
      <span style={{ color: theme.colors.grey80 }}>
        Search for a parent issue.
      </span>
  );
};

export const SubtaskDropdownWithSearch: FC<DropdownWithSearchProps> = ({ helpers, id, placeholder, value, projectId, ...props }) => {
  const { client } = useDeskproAppClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDirtySearch, setIsDirtySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [parents, setParents] = useState<Record<string, IssueSearchItem>>({});
  const [parentOptions, setParentOptions] = useState<DropdownValueType<IssueSearchItem["key"]>[] | DropdownHeaderType[]>([]);

  const getIssueTitle = (): string => {
    const issue = get(parents, [value], null);

    if (isEmpty(issue)) {
      return value ? value : "";
    } else {
      return `[${issue.key}] ${issue.summary}`;
    }
  };

  const debouncedSearch = useDebouncedCallback<(v: string) => void>((q) => {
    if (!q || !client) {
      setParents({});
      return;
    }

    setLoading(true);
    searchIssues(client, q, { projectId })
        .then((stories) => setParents(normalize(stories, "key")))
        .finally(() => setLoading(false));
  }, 500);

  useEffect(() => {
    if (isEmpty(parents)) {
      setParentOptions([{
        type: "header",
        label: isDirtySearch ? <NoFound/> : <SearchForParent/>,
      }]);
    } else {
      setParentOptions(values(parents).map((issue) => ({
        key: issue.key,
        label: `[${issue.key}] ${issue.summary}`,
        value: issue.key,
        type: "value" as const,
      })))
    }
  }, [parents, isDirtySearch]);

  useEffect(() => {
    if (loading) {
      setParentOptions([{
        type: "header",
        label: (<div style={{ textAlign: "center" }}><Spinner size="small"/></div>),
      }]);
    }
  }, [loading]);

  return (
    <Dropdown
      {...props}
      showInternalSearch
      options={parentOptions}
      inputValue={searchQuery}
      onInputChange={(e) => {
        setSearchQuery(e);
        debouncedSearch(e);
        !isDirtySearch && setIsDirtySearch(true);
      }}
      onSelectOption={(option) => {
        helpers.setTouched(true);
        helpers.setValue(option.value);
      }}
      fetchMoreText="Fetch more"
      autoscrollText="Autoscroll"
      selectedIcon={faHandPointer as AnyIcon}
      externalLinkIcon={faExternalLinkAlt as AnyIcon}
      optionsRenderer={(
        opts,
        handleSelectOption,
        activeItem,
        activeSubItem,
        setActiveSubItem,
        hideIcons
      ) => (
        <Infinite
          maxHeight={"30vh"}
          anchor={false}
          scrollSideEffect={() => setActiveSubItem(null)}
          fetchMoreText="Fetch more"
          autoscrollText="Autoscroll"
        >
          <div style={{ maxHeight: "30vh" }}>
            {opts.map(
              dropdownRenderOptions({
                handleSelectOption,
                activeItem,
                activeSubItem,
                setActiveSubItem,
                fetchMoreText: "Fetch more",
                autoscrollText: "Autoscroll",
                selectedIcon: faHandPointer as AnyIcon,
                externalLinkIcon: faExternalLinkAlt as AnyIcon,
                hasSelectedItems: false,
                hasExpandableItems: false,
                hideIcons,
                setActiveValueIndex: () => {},
                valueOptions: [],
              })
            )}
          </div>
        </Infinite>
      )}
      hideIcons
    >
      {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => (
        <DivAsInputWithDisplay
          id={id}
          placeholder={placeholder}
          value={getIssueTitle()}
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
