import { isEmpty } from "lodash";
import { IssueFieldView } from "./IssueFieldView/IssueFieldView";
import type { FC } from "react";
import type { Maybe } from "../../../../types";
import type { IssueItem } from "../../../../services/jira/types";

type Props = {
  customFields: Maybe<IssueItem["customFields"]>,
};

const CustomFields: FC<Props> = ({ customFields }) => {
  if (isEmpty(customFields)) {
    return (<></>);
  }


  return (
    <>
      {Object.keys(customFields).map((key: string, idx: number) => (
        <IssueFieldView
          key={idx}
          meta={customFields[key].meta}
          value={customFields[key].value}
        />
      ))}
    </>
  );
};

export { CustomFields };
