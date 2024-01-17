import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { Formik, FormikHelpers } from "formik";
import {
    Input,
    Label,
    Stack,
    Button,
    TextArea,
    FormikField,
} from "@deskpro/deskpro-ui";
import {
    LoadingSpinner,
    HorizontalDivider,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { isNeedField, isRequiredField } from "../../utils";
import { useFormDeps } from "./hooks";
import { schema, getInitValues } from "./utils";
import { CustomField } from "./IssueFieldForm/map";
import {
  ErrorBlock,
  DropdownSelect,
  AttachmentsField,
  DropdownMultiSelect,
  SubtaskDropdownWithSearch,
} from "../common";
import type { IssueFormData, AttachmentFile } from "../../services/jira/types";
import type { IssueFormProps } from "./types";
import "./IssueForm.css";

export const IssueForm: FC<IssueFormProps> = ({ onSubmit, values, type, apiErrors, editMeta, issueKey, loading = false }: IssueFormProps) => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext();
    const {
      projects,
      isLoading,
      userOptions,
      extraLabels,
      labelOptions,
      projectOptions,
      getCustomFields,
      buildPriorityOptions,
      buildIssueTypeOptions,
    } = useFormDeps(values, editMeta);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    const submit = (values: IssueFormData, helpers: FormikHelpers<IssueFormData>) => {
        const { labels, priority, assigneeUserId, reporterUserId, ...data } = values;
        const isNeed = ((projects, projectId, issueTypeId) => {
            return (fieldName: string) => {
                return isNeedField({ projects, fieldName, projectId, issueTypeId })
            }
        })(projects, values.projectId, values.issueTypeId);

        return onSubmit(
            {
                ...data,
                ...(!isNeed("labels") ? {} : { labels }),
                ...(!isNeed("priority") ? {} : { priority }),
                ...(!isNeed("assignee") ? {} : { assigneeUserId }),
                ...(!isNeed("reporter") ? {} : { reporterUserId })
            },
            helpers,
            getCustomFields(values.projectId, values.issueTypeId)
        )
    };

    return (
        <IntlProvider locale="en">
            <Formik
                initialValues={getInitValues(values, context)}
                onSubmit={submit}
                validationSchema={schema}
            >
                {({ values, submitForm, resetForm, errors, submitCount }) => {
                    const is = ((projects, projectId, issueTypeId) => {
                        return (fieldName: string) => {
                            return isNeedField({ projects, fieldName, projectId, issueTypeId })
                        }
                    })(projects, values.projectId, values.issueTypeId);

                    const isRequired = ((projects, projectId, issueTypeId) => (fieldName: string) => {
                        return isRequiredField({ projects, fieldName, projectId, issueTypeId })
                    })(projects, values.projectId, values.issueTypeId);

                    return (
                        <Stack gap={10} vertical>
                            {Object.values({...errors, ...apiErrors}).length > 0 && submitCount > 0 && (
                                <ErrorBlock text={Object.values({...errors, ...apiErrors}) as string|string[]} />
                            )}
                            <div className="create-form-field">
                                <FormikField<string> name="projectId">
                                    {([field, , helpers], { id, error }) => (
                                        <Label htmlFor={id} label="Project" error={error}>
                                            <DropdownSelect
                                                disabled={type === "update"}
                                                helpers={helpers}
                                                options={projectOptions}
                                                id={id}
                                                placeholder="Select value"
                                                value={field.value}
                                                containerMaxHeight={350}
                                            />
                                        </Label>
                                    )}
                                </FormikField>
                            </div>
                            {values.projectId && (
                                <div className="create-form-field">
                                    <FormikField<string> name="issueTypeId">
                                        {([field, , helpers], { id, error }) => (
                                            <Label htmlFor={id} label="Issue Type" error={error}>
                                                <DropdownSelect
                                                    disabled={type === "update"}
                                                    helpers={helpers}
                                                    options={buildIssueTypeOptions(values.projectId)}
                                                    id={id}
                                                    placeholder="Select value"
                                                    value={field.value}
                                                />
                                            </Label>
                                        )}
                                    </FormikField>
                                </div>
                            )}
                            {values.projectId && isRequired("parent") && (
                                <div className="create-form-field">
                                    <FormikField<string> name="parentKey">
                                        {([field, , helpers], { id, error }) => (
                                            <Label htmlFor={id} label="Parent" error={error}>
                                                <SubtaskDropdownWithSearch
                                                    projectId={values.projectId}
                                                    helpers={helpers}
                                                    id={id}
                                                    placeholder="Select value"
                                                    value={field.value}
                                                />
                                            </Label>
                                        )}
                                    </FormikField>
                                </div>
                            )}
                            <div className="create-form-field">
                                <FormikField<string> name="summary">
                                    {([field], { id, error }) => (
                                        <Label
                                            htmlFor={id}
                                            label="Summary"
                                            error={error}
                                        >
                                            <Input id={id} {...field} variant="inline" placeholder="Add value" />
                                        </Label>
                                    )}
                                </FormikField>
                            </div>
                            <div className="create-form-field">
                                <FormikField<string> name="description">
                                    {([field], { id, error }) => (
                                        <Label
                                            htmlFor={id}
                                            label="Description"
                                            error={error}
                                        >
                                            <TextArea
                                                id={id}
                                                {...field}
                                                variant="inline"
                                                placeholder="Add Value"
                                                rows={5}
                                                className={`paragraph-field ${field.value ? "has-value" : ""}`}
                                            />
                                        </Label>
                                    )}
                                </FormikField>
                            </div>
                            {is("assignee") && (
                                <div className="create-form-field">
                                    <FormikField<string> name="assigneeUserId">
                                        {([field, , helpers], { id, error }) => (
                                            <Label htmlFor={id} label="Assignee" error={error}>
                                                <DropdownSelect
                                                    helpers={helpers}
                                                    options={userOptions}
                                                    id={id}
                                                    placeholder="Select value"
                                                    value={field.value}
                                                />
                                            </Label>
                                        )}
                                    </FormikField>
                                </div>
                            )}
                            {is("reporter") && (
                                <div className="create-form-field">
                                    <FormikField<string> name="reporterUserId">
                                        {([field, , helpers], { id, error }) => (
                                            <Label htmlFor={id} label="Reporter" error={error}>
                                                <DropdownSelect
                                                    helpers={helpers}
                                                    options={userOptions}
                                                    id={id}
                                                    placeholder="Select value"
                                                    value={field.value}
                                                />
                                            </Label>
                                        )}
                                    </FormikField>
                                </div>
                            )}
                            {(values.projectId && values.issueTypeId && is("priority")) && (
                                <div className="create-form-field">
                                    <FormikField<string> name="priority">
                                        {([field, , helpers], { id, error }) => (
                                            <Label htmlFor={id} label="Priority" error={error}>
                                                <DropdownSelect
                                                    helpers={helpers}
                                                    options={buildPriorityOptions(values.projectId, values.issueTypeId)}
                                                    id={id}
                                                    placeholder="Select value"
                                                    value={field.value}
                                                />
                                            </Label>
                                        )}
                                    </FormikField>
                                </div>
                            )}
                            <div className="create-form-field">
                                <Label label="Attachments" />
                                <FormikField<AttachmentFile[]> name="attachments">
                                    {([field, , helpers]) => (
                                        <AttachmentsField onFiles={helpers.setValue} existing={field.value} />
                                    )}
                                </FormikField>
                            </div>
                            {is("labels") && (
                                <div className="create-form-field">
                                    <FormikField<string[]> name="labels">
                                        {([field, , helpers], { id, error }) => (
                                            <Label
                                                htmlFor={id}
                                                label="Labels"
                                                error={error}
                                            >
                                                <DropdownMultiSelect
                                                    helpers={helpers}
                                                    options={labelOptions}
                                                    id={id}
                                                    placeholder="Select values"
                                                    values={field.value}
                                                />
                                            </Label>
                                        )}
                                    </FormikField>
                                </div>
                            )}
                            {Object.values(getCustomFields(values.projectId, values.issueTypeId)).map((meta, idx: number) => (
                                <CustomField meta={meta} key={idx} apiErrors={apiErrors} extraLabels={extraLabels} />
                            ))}
                            <HorizontalDivider />
                            <div className="create-form-field">
                                <Stack justify="space-between">
                                    <Button text={type === "create" ? "Create" : "Update"} onClick={() => submitForm()} loading={loading} />
                                    {type === "update" && issueKey ? (
                                        <Button text="Cancel" intent="secondary" onClick={() => navigate(`/view${issueKey}`)} />
                                    ) : (
                                        <Button text="Reset" intent="secondary" onClick={() => resetForm()} />
                                    )}
                                </Stack>
                            </div>
                        </Stack>
                    )
                }}
            </Formik>
        </IntlProvider>
    );
};
