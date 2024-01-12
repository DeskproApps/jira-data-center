import get from "lodash/get";
import size from "lodash/size";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import {
  P5,
  Pill,
  Stack,
  AttachmentTag,
} from "@deskpro/deskpro-ui";
import {
  Title,
  Member,
  Property,
  LinkIcon,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { useExternalLink } from "../../../hooks";
import { nbsp } from "../../../constants";
import {
  JiraIcon,
  DPNormalize,
} from "../../common";
import type { FC } from "react";
import type { AnyIcon } from "@deskpro/deskpro-ui";
import type { Maybe } from "../../../types";
import type { IssueItem, IssueAttachment } from "../../../context/StoreProvider/types";

type Props = {
  issue?: IssueItem,
  attachments?: Maybe<IssueAttachment[]>,
};

const Details: FC<Props> = ({ issue, attachments }) => {
  const { theme } = useDeskproAppTheme();
  const { getBaseUrl } = useExternalLink();

  return (
    <>
      <Title
        title={get(issue, ["summary"], "-")}
        icon={<JiraIcon/>}
        link={`${getBaseUrl()}/browse/${issue?.key}`}
      />
      <Property
        label="Issue Key"
        text={(
          <P5>
            {issue?.key}{nbsp}
            <LinkIcon href={`${getBaseUrl()}/browse/${issue?.key}`}/>
          </P5>
        )}
      />
      {issue?.parentKey && (
        <Property
          label="Parent"
          text={(
            <P5>
              {issue?.parentKey}{nbsp}
              <LinkIcon href={`${getBaseUrl()}/browse/${issue.parentKey}`} />
            </P5>
          )}
        />
      )}
      {issue?.description && (
        <Property
          label="Description"
          text={<DPNormalize text={issue?.description as never} />}
        />
      )}
      <Property
        label="Project"
        text={(
          <P5>
            {issue?.projectName}{nbsp}
            <LinkIcon href={`${getBaseUrl()}/browse/${issue?.projectKey}`} />
          </P5>
        )}
      />
      {issue?.epicKey && (
        <Property
          label="Epic"
          text={(
            <P5>
              {issue?.epicName}{nbsp}
              <LinkIcon href={`${getBaseUrl()}/browse/${issue.epicKey}`} />
            </P5>
          )}
        />
      )}
      {(size(issue?.sprints) > 0) && (
        <Property
          label="Sprints"
          text={(issue?.sprints || []).map((sprint, idx) => (
            <P5 key={idx}>
              {sprint.sprintName} ({sprint.sprintState})
              <LinkIcon href={`${getBaseUrl()}/jira/software/c/projects/${issue?.projectKey}/boards/${sprint.sprintBoardId}`} />
            </P5>
          ))}
        />
      )}
      <Property label="Status" text={issue?.status || "-"}/>
      <Property
        label="Assignee"
        text={!issue?.assigneeId ? "-" : (
          <>
            <Member
              name={issue.assigneeName}
              avatarUrl={issue.assigneeAvatarUrl}
            />
          </>
        )}
      />
      <Property
        label="Reporter"
        text={!issue?.reporterName ? "-" : (
          <>
            <Member
              name={issue.reporterName}
              avatarUrl={issue.reporterAvatarUrl}
            />
          </>
        )}
      />
      <Property
        label="Labels"
        text={(
          <Stack gap={6} wrap="wrap">
            {!size(issue?.labels) ? "-" : (issue?.labels || []).map((label, idx) => (
              <Pill
                key={idx}
                label={label}
                textColor={theme.colors.grey100}
                backgroundColor={theme.colors.grey10}
              />
            ))}
          </Stack>
        )}
      />
      <Property
        label="Priority"
        text={!issue?.priority ? "-" : (
          <Stack gap={3}>
            <img src={issue.priorityIconUrl} alt={issue.priority} height={16} />
            <P5>{issue.priority}</P5>
          </Stack>
        )}
      />
      <Property
        label="Attachments"
        text={!size(attachments) ? "-" : (
          <Stack gap={6} vertical>
            {(attachments || []).map((attachment, idx) => (
              <AttachmentTag
                key={idx}
                target="_blank"
                download
                href={attachment.url}
                filename={attachment.filename}
                fileSize={attachment.sizeBytes}
                icon={faFile as AnyIcon}
              />
            ))}
          </Stack>
        )}
      />
    </>
  );
};

export {Details};
