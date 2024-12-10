import type { To, ParamKeyValuePair } from "react-router-dom";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Context, IDeskproClient } from "@deskpro/app-sdk";
import type {JiraUserInfo, JiraIssueDetails, IssueItem} from "./services/jira/types";
import type { Response } from "./services/jira/types";

/** Common types */
export type Maybe<T> = T | undefined | null;

export type Nothing = undefined;

export type Dict<T> = Record<string, T>;

export type Option<Value = unknown> = Omit<DropdownValueType<Value>, "subItems">;

/** Request types */
export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestParams = {
  url?: string,
  rawUrl?: string,
  method?: ApiRequestMethod,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Dict<any>|RequestInit["body"],
  headers?: Dict<string>,
  queryParams?: string|Dict<string>|ParamKeyValuePair[],
};

export type Request = <T>(
  client: IDeskproClient,
  params: RequestParams,
) => Response<T>;

/**  An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"` */
export type DateTime = string;

export type NavigateToChangePage = { type: "changePage", path: To };

export type ElementEventPayload =
  | undefined
  | string
  | { type: "unlink", issueKey: IssueItem["key"] }
  | NavigateToChangePage
;

export enum FieldType {
    REQUEST_LANG = "com.atlassian.servicedesk.servicedesk-lingo-integration-plugin:sd-request-language",
    TEXT_PLAIN = "com.atlassian.jira.plugin.system.customfieldtypes:textfield",
    TEXT_PARAGRAPH = "com.atlassian.jira.plugin.system.customfieldtypes:textarea",
    DATE = "com.atlassian.jira.plugin.system.customfieldtypes:datepicker",
    DATETIME = "com.atlassian.jira.plugin.system.customfieldtypes:datetime",
    CHECKBOXES = "com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes",
    LABELS = "com.atlassian.jira.plugin.system.customfieldtypes:labels",
    NUMBER = "com.atlassian.jira.plugin.system.customfieldtypes:float",
    RADIO_BUTTONS = "com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons",
    SELECT_CASCADE = "com.atlassian.jira.plugin.system.customfieldtypes:cascadingselect",
    SELECT_MULTI = "com.atlassian.jira.plugin.system.customfieldtypes:multiselect",
    SELECT_SINGLE = "com.atlassian.jira.plugin.system.customfieldtypes:select",
    URL = "com.atlassian.jira.plugin.system.customfieldtypes:url",
    USER_PICKER = "com.atlassian.jira.plugin.system.customfieldtypes:userpicker",
    EPIC_NAME = "com.pyxis.greenhopper.jira:gh-epic-label",
}

export type IssueMeta = {
        type: FieldType.TEXT_PLAIN;
        key: string;
        name: string;
        required: boolean;
    } | {
        type: FieldType.DATE;
        key: string;
        name: string;
        required: boolean;
    } | {
        type: FieldType.DATETIME;
        key: string;
        name: string;
        required: boolean;
    } | {
        type: FieldType.REQUEST_LANG;
        key: string;
        name: string;
        required: boolean;
        allowedValues: {
            languageCode: string;
            displayName: string;
        }[];
    } | {
        type: FieldType.CHECKBOXES;
        key: string;
        name: string;
        required: boolean;
        allowedValues: {
            id: string;
            value: string;
        }[];
    } | {
        type: FieldType.LABELS;
        key: string;
        name: string;
        required: boolean;
        autoCompleteUrl: string;
    } | {
        type: FieldType.NUMBER;
        key: string;
        name: string;
        required: boolean;
    } | {
        type: FieldType.TEXT_PARAGRAPH;
        key: string;
        name: string;
        required: boolean;
    } | {
        type: FieldType.RADIO_BUTTONS;
        key: string;
        name: string;
        required: boolean;
        allowedValues: {
            id: string;
            value: string;
        }[];
    } | {
        type: FieldType.SELECT_CASCADE;
        key: string;
        name: string;
        required: boolean;
        allowedValues: {
            id: string;
            value: string;
        }[];
    } | {
        type: FieldType.SELECT_MULTI;
        key: string;
        name: string;
        required: boolean;
        allowedValues: {
            id: string;
            value: string;
        }[];
    } | {
        type: FieldType.SELECT_SINGLE;
        key: string;
        name: string;
        required: boolean;
        allowedValues: {
            id: string;
            value: string;
        }[];
    } | {
        type: FieldType.URL;
        key: string;
        name: string;
        required: boolean;
    } | {
        type: FieldType.USER_PICKER;
        key: string;
        name: string;
        required: boolean;
        autoCompleteUrl: string;
    }
;

export type IssueValue = {
    [FieldType.REQUEST_LANG]: Maybe<Array<{ languageCode: string, displayName: string }>>,
    [FieldType.TEXT_PLAIN]: Maybe<string>,
    [FieldType.TEXT_PARAGRAPH]: Maybe<string>,
    [FieldType.DATE]: Maybe<DateTime>,
    [FieldType.DATETIME]: Maybe<DateTime>,
    [FieldType.CHECKBOXES]: Array<{self: string, value: string, id: string }>,
    [FieldType.LABELS]: Maybe<string[]>,
    [FieldType.NUMBER]: Maybe<number>,
    [FieldType.RADIO_BUTTONS]: Maybe<{ self: string, value: string, id: string }>,
    [FieldType.SELECT_CASCADE]: Maybe<{ self: string, value: string, id: string }>,
    [FieldType.SELECT_MULTI]: Maybe<Array<{ self: string, value: string, id: string }>>,
    [FieldType.SELECT_SINGLE]: Maybe<{ self: string, value: string, id: string }>,
    [FieldType.URL]: Maybe<string>,
    [FieldType.USER_PICKER]: Maybe<JiraUserInfo>,
} & Record<string, null>;

export interface ReplyBoxNoteSelection {
    id: string;
    selected: boolean;
}

export interface ReplyBoxOnReply {
    note: string;
}

export type Settings = {
    instance_url?: string,
    api_key?: string,
    verify_settings?: string,
    default_comment_on_ticket_reply?: string,
    default_comment_on_ticket_note?: string,
    ticket_subject_as_issue_summary?: string,
};

export type TicketData = {
    env: object,
    app: object,
    currentAgent: object,
    ticket: {
      id: string,
      subject: string,
      permalinkUrl: string,
    },
};

export type TicketContext = Context<TicketData, Maybe<Settings>>;

export type EntityMetadata = JiraIssueDetails;
