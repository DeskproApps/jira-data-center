import { FC, useEffect, useMemo } from "react";
import {
  useSetAppTitle,
  useExternalLink,
  useFindLinkedIssueByKey,
  useLoadLinkedIssueAttachment,
  useFindLinkedIssueAttachmentsByKey,
} from "../hooks";
import {
  H1,
  P5,
  Pill,
  Stack,
  Spinner,
  AnyIcon,
  AttachmentTag,
} from "@deskpro/deskpro-ui";
import {
  Property,
  HorizontalDivider,
  useDeskproAppTheme,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { ExternalLink } from "../components/ExternalLink/ExternalLink";
import { useStore } from "../context/StoreProvider/hooks";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { IssueFieldView } from "../components/IssueFieldView/IssueFieldView";
import { CommentsList } from "../components/CommentsList/CommentsList";
import { DPNormalize } from "../components/Typography";

export interface ViewProps {
  issueKey: string;
}

export const View: FC<ViewProps> = ({ issueKey }: ViewProps) => {
  const [state, dispatch] = useStore();
  const { theme } = useDeskproAppTheme();
  const { client } = useDeskproAppClient();

  const loadIssueAttachments = useLoadLinkedIssueAttachment();
  const findAttachmentsByKey = useFindLinkedIssueAttachmentsByKey();
  const findByKey = useFindLinkedIssueByKey();
  const { getBaseUrl } = useExternalLink();

  useSetAppTitle(issueKey || "");

  useEffect(() => {
    client?.registerElement("home", { type: "home_button" });
    // client?.registerElement("edit", { type: "edit_button", payload: issueKey });
    client?.deregisterElement("homeContextMenu");
    client?.registerElement("viewContextMenu", { type: "menu", items: [
      { title: "Unlink Ticket", payload: { action: "unlink", issueKey }, },
    ] });
  }, [client, issueKey]);

  const issue = useMemo(
    () => findByKey(issueKey),
    [issueKey, findByKey]
  );

  useEffect(() => {
    loadIssueAttachments(issueKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueKey]);

  const attachments = useMemo(
    () => state.linkedIssueAttachments ? findAttachmentsByKey(issueKey) : [],
    [issueKey, findAttachmentsByKey, state.linkedIssueAttachments]
  );

  if (state.isUnlinkingIssue) {
    return (<></>);
  }

  if (!issue) {
    dispatch({ type: "error", error: "Issue not found" });
    return (<></>);
  }

  return (
    <>
      <Stack align="start" gap={10}>
        <Stack gap={10} vertical>
          <div style={{ display: "flex", alignItems: "start", marginBottom: "-6px" }}>
            <H1 style={{ marginRight: "1px" }}>{issue.summary}</H1>
            <ExternalLink href={`${getBaseUrl()}/browse/${issue.key}`} style={{ position: "relative", top: "-4px" }} />
          </div>
          <Property
              label="Issue Key"
              text={(
                  <P5>
                    {issue.key}
                    <ExternalLink href={`${getBaseUrl()}/browse/${issue.key}`} />
                  </P5>
              )}
          />
          {issue.parentKey && (
            <Property
                label="Parent"
                text={(
                    <P5>
                      {issue.parentKey}
                      <ExternalLink href={`${getBaseUrl()}/browse/${issue.parentKey}`} />
                    </P5>
                )}
            />
          )}
          {issue.description && (
            <Property
                label="Description"
                text={<DPNormalize text={issue.description as never} />}
            />
          )}
          <Property
              label="Project"
              text={(
                  <P5>
                    {issue.projectName}
                    <ExternalLink href={`${getBaseUrl()}/browse/${issue.projectKey}`} />
                  </P5>
              )}
          />
          {issue.epicKey && (
            <Property
                label="Epic"
                text={(
                    <P5>
                      {issue.epicName}
                      <ExternalLink href={`${getBaseUrl()}/browse/${issue.epicKey}`} />
                    </P5>
                )}
            />
          )}
          {(issue.sprints ?? []).length > 0 && (
            <Property
                label="Sprints"
                text={(issue.sprints ?? []).map((sprint, idx) => (
                    <div key={idx}>
                      {sprint.sprintName} ({sprint.sprintState})
                      <ExternalLink href={`${getBaseUrl()}/jira/software/c/projects/${issue?.projectKey}/boards/${sprint.sprintBoardId}`} />
                    </div>
                ))}
            />
          )}
          <Property label="Status" text={issue.status}/>
          <Property
              label="Assignee"
              text={issue.assigneeId ? (
                  <div style={{ position: "relative" }}>
                    {issue.assigneeAvatarUrl && (
                        <img src={issue.assigneeAvatarUrl} width={18} height={18} alt="" className="user-avatar" />
                    )}
                    <span className="user-name">{issue.assigneeName}</span>
                    {issue.assigneeId && (
                        <ExternalLink href={`${getBaseUrl()}/jira/people/${issue.assigneeId}`} />
                    )}
                  </div>
              ) : (
                  <span style={{ color: theme.colors.grey80 }}>None</span>
              )}
          />
          <Property
              label="Reporter"
              text={(
                  <div style={{position: "relative"}}>
                    {issue.reporterAvatarUrl && (
                        <img src={issue.reporterAvatarUrl} width={18} height={18} alt="" className="user-avatar"/>
                    )}
                    <span className="user-name">{issue.reporterName}</span>
                    {issue.reporterId && (
                        <ExternalLink href={`${getBaseUrl()}/jira/people/${issue.reporterId}`}/>
                    )}
                  </div>
              )}
          />
          {(issue.labels && issue.labels.length > 0) && (
              <Property
                  label="Labels"
                  text={(
                      <Stack gap={3}>
                        {issue.labels.map((label, idx) => (
                            <Pill label={label} textColor={theme.colors.grey100} backgroundColor={theme.colors.grey10}
                                  key={idx}/>
                        ))}
                      </Stack>
                  )}
            />
          )}
          {issue.priority && (
              <Property
                  label="Priority"
                  text={(
                      <Stack gap={3}>
                        <img src={issue.priorityIconUrl} alt={issue.priority} height={16} />
                        {issue.priority}
                      </Stack>
                  )}
              />
          )}
          {state.linkedIssueAttachments?.loading && (
            <Spinner size="small" />
          )}
          {(!state.linkedIssueAttachments?.loading && attachments.length > 0) && (
            <Property
                label="Attachments"
                text={(
                    <Stack gap={3} vertical>
                      {attachments.map((attachment, idx) => (
                          <AttachmentTag
                              key={idx}
                              target="_blank"
                              download
                              href={attachment.url}
                              filename={attachment.filename}
                              fileSize={attachment.sizeBytes}
                              icon={faFile as AnyIcon}
                              maxWidth="244px"
                          />
                      ))}
                    </Stack>
                )}
            />
          )}
          {Object.keys(issue.customFields).map((key: string, idx: number) => (
              <IssueFieldView meta={issue.customFields[key].meta} value={issue.customFields[key].value} key={idx} />
          ))}
          <Stack vertical gap={10} style={{ width: "100%" }}>
            <HorizontalDivider style={{ width: "100%" }} />
            <CommentsList issueKey={issueKey} />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
