import { get, omit } from "lodash";
import { match, P } from "ts-pattern";
import { FieldType } from "../../types";
import { paragraphDoc } from "../../utils/adf";
import { useAdfToPlainText } from "../../hooks";
import type { IssueMeta } from "../../types";
import type {
  JiraIssueDetails,
  JiraIssueFieldMeta,
  JiraIssueCustomFieldMeta,
} from "./types";

export const findEpicLinkMeta = (issue: JiraIssueDetails) => {
  return Object
    .values(issue.editmeta.fields)
    .filter((field: JiraIssueFieldMeta|JiraIssueCustomFieldMeta) => {
      return get(field, ["schema", "custom"]) === "com.pyxis.greenhopper.jira:gh-epic-link"
    })[0] ?? null;
};

export const findSprintLinkMeta = (issue: JiraIssueDetails) => {
  return Object
    .values(issue.editmeta.fields)
    .filter((field: JiraIssueFieldMeta|JiraIssueCustomFieldMeta) => {
      return get(field, ["schema", "custom"]) === "com.pyxis.greenhopper.jira:gh-sprint"
    })[0] ?? null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const combineCustomFieldValueAndMeta = (values: any, meta: any) => {
  return Object.keys(meta).reduce((fields, key) => ({
    ...fields,
    [key]: {
      value: values[key],
      meta: meta[key],
    },
  }), {});
};

export const isCustomFieldKey = (key: string): boolean => {
  return /^customfield_[0-9]+$/.test(key);
};

export const extractCustomFieldValues = (fields: JiraIssueDetails["fields"]) => {
  return Object.keys(fields).reduce((customFields, key) => {
    if (!isCustomFieldKey(key)) {
      return customFields;
    }

    return { ...customFields, [key]: get(fields, [key]) };
  }, {});
};

export const remoteLinkGlobalId = (ticketId: string) => {
  return `deskpro_ticket_${ticketId}`;
};

export const extractCustomFieldMeta = (fields: JiraIssueDetails["editmeta"]["fields"]) => {
  return Object.keys(fields).reduce((customFields, key) => {
    if (!isCustomFieldKey(key)) {
      return customFields;
    }

    return { ...customFields, [key]: get(fields, [key]) };
  }, {});
};

export const transformFieldMeta = (field: JiraIssueCustomFieldMeta) => {
  return {
    type: field.schema.custom,
    key: field.fieldId,
    name: field.name,
    required: field.required,
    ...omit(field, ["key", "name", "operations", "schema", "required"]),
  };
};

export const buildCustomFieldMeta = (fields: JiraIssueDetails["editmeta"]["fields"]) => {
  const customFields: Record<string, JiraIssueCustomFieldMeta> = extractCustomFieldMeta(fields);

  return Object.keys(customFields).reduce((fields, key) => ({
    ...fields,
    [key]: transformFieldMeta(customFields[key]),
  }), {});
};


/**
 * Format fields when sending values to API
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatCustomFieldValue = (meta: IssueMeta, value: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return match<FieldType, any>(meta.type)
    .with(P.union(
      FieldType.TEXT_PLAIN,
      FieldType.EPIC_NAME,
    ), () => value ?? undefined)
    .with(FieldType.TEXT_PARAGRAPH, () => value ? paragraphDoc(value) : undefined)
    .with(FieldType.DATETIME, () => value ?? undefined)
    .with(FieldType.DATE, () => value ?? undefined)
    .with(FieldType.CHECKBOXES, () => (value ?? []).map((id: string) => ({ id })))
    .with(FieldType.LABELS, () => value ?? [])
    .with(FieldType.NUMBER, () => value ? new Number(value) : undefined)
    .with(FieldType.RADIO_BUTTONS, () => value ? ({ id: value }) : undefined)
    .with(FieldType.SELECT_MULTI, () => (value ?? []).map((id: string) => ({ id })))
    .with(FieldType.SELECT_SINGLE, () => value ? ({ id: value }) : undefined)
    .with(FieldType.URL, () => value ?? undefined)
    .with(FieldType.USER_PICKER, () => value ? ({ name: value }) : undefined)
    .run()
};

/**
 * Format data when getting values from the API
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatCustomFieldValueForSet = (meta: IssueMeta, value: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return match<FieldType, any>(meta.type)
    .with(P.union(
      FieldType.TEXT_PLAIN,
      FieldType.EPIC_NAME,
    ), () => value ?? "")
    .with(FieldType.TEXT_PARAGRAPH, () => useAdfToPlainText()(value))
    .with(FieldType.DATETIME, () => value ? new Date(value) : undefined)
    .with(FieldType.DATE, () => value ? new Date(value) : undefined)
    .with(FieldType.CHECKBOXES, () => (value ?? []).map((v: { id: string }) => v.id))
    .with(FieldType.LABELS, () => value ?? [])
    .with(FieldType.NUMBER, () => value ? `${value}` : "")
    .with(FieldType.RADIO_BUTTONS, () => value?.id ?? undefined)
    .with(FieldType.SELECT_MULTI, () => (value ?? []).map((v: { id: string }) => v.id))
    .with(FieldType.SELECT_SINGLE, () => value?.id ?? undefined)
    .with(FieldType.URL, () => value ?? "")
    .with(FieldType.USER_PICKER, () => value?.accountId ?? undefined)
    .otherwise(() => undefined);
};
