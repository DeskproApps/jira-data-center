import { FC, useState } from "react";
import { size, isPlainObject, isString } from "lodash";
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
import { isRequiredField } from "../../utils";
import { useFormDeps } from "./hooks";
import { schema, getInitValues } from "./utils";
import { CustomField } from "./IssueFieldForm/map";
import {
  ErrorBlock,
  UserSelect,
  DropdownSelect,
  DropdownMultiSelect,
  SubtaskDropdownWithSearch,
} from "../common";
import type { TicketData, Settings } from "../../types";
import type { IssueFormData } from "../../services/jira/types";
import type { IssueFormProps } from "./types";
import "./IssueForm.css";

export const IssueForm: FC<IssueFormProps> = ({
    onSubmit,
    values,
    type,
    apiErrors,
    editMeta,
    issueKey,
    loading = false,
}: IssueFormProps) => {
    const [currentValues, setCurrentValues] = useState(values);
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext<TicketData, Settings>();
    const {
      projects,
      isLoading,
      extraLabels,
      labelOptions,
      projectOptions,
      customFields,
      priorityOptions,
      issueTypeOptions,
    } = useFormDeps(currentValues, editMeta);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    const submit = (values: IssueFormData, helpers: FormikHelpers<IssueFormData>) => {
        return onSubmit(values, helpers, customFields)
    };

    return (
        <IntlProvider locale="en">
            <Formik
                initialValues={getInitValues(values, context)}
                onSubmit={submit}
                validationSchema={schema}
            >
                {({ values, submitForm, resetForm, errors, submitCount }) => {
                    setCurrentValues(values);

                    const isRequired = ((projects, projectId, issueTypeId) => (fieldName: string) => {
                        return isRequiredField({ projects, fieldName, projectId, issueTypeId })
                    })(projects, values.projectId, values.issueTypeId);

                    const fullErrors = [
                      ...Object.values(errors),
                      ...(isPlainObject(apiErrors)
                        ? Object.values(apiErrors as object)
                        : Array.isArray(apiErrors)
                        ? apiErrors
                        : isString(apiErrors)
                        ? [apiErrors]
                        : []
                      ),
                    ];

                    return (
                        <Stack gap={10} vertical>
                            {(Boolean(size(fullErrors)) && Boolean(submitCount)) && (
                                <ErrorBlock text={fullErrors} />
                            )}
                            <div className="create-form-field">
                                <FormikField<string> name="projectId">
                                    {([field, , helpers], { id, error }) => (
                                        <Label htmlFor={id} label="Project" error={error} required>
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
                                            <Label htmlFor={id} label="Issue Type" error={error} required>
                                                <DropdownSelect
                                                    disabled={type === "update"}
                                                    helpers={helpers}
                                                    options={issueTypeOptions}
                                                    id={id}
                                                    placeholder="Select value"
                                                    value={field.value}
                                                />
                                            </Label>
                                        )}
                                    </FormikField>
                                </div>
                            )}

                            {values.projectId && values.issueTypeId && (
                              <>
                                {isRequired("parent") && (
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
                                          <Label htmlFor={id} label="Summary" error={error} required>
                                              <Input id={id} {...field} variant="inline" placeholder="Add value" />
                                          </Label>
                                      )}
                                  </FormikField>
                              </div>

                              <div className="create-form-field">
                                  <FormikField<string> name="description">
                                      {([field], { id, error }) => (
                                          <Label htmlFor={id} label="Description" error={error} required>
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

                              <div className="create-form-field">
                                  <FormikField<string> name="assigneeUserId">
                                      {([field, , helpers], { id, error }) => (
                                          <Label htmlFor={id} label="Assignee" error={error}>
                                              <UserSelect id={id} helpers={helpers} value={field.value} />
                                          </Label>
                                      )}
                                  </FormikField>
                              </div>

                              <div className="create-form-field">
                                  <FormikField<string> name="reporterUserId">
                                      {([field, , helpers], { id, error }) => (
                                          <Label htmlFor={id} label="Reporter" error={error} required>
                                              <UserSelect id={id} helpers={helpers} value={field.value} />
                                          </Label>
                                      )}
                                  </FormikField>
                              </div>

                              {(values.projectId && values.issueTypeId) && (
                                  <div className="create-form-field">
                                      <FormikField<string> name="priority">
                                          {([field, , helpers], { id, error }) => (
                                              <Label htmlFor={id} label="Priority" error={error}>
                                                  <DropdownSelect
                                                      helpers={helpers}
                                                      options={priorityOptions}
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
                              </>
                            )}

                            {Object.values(customFields).map((meta, idx: number) => (
                              <CustomField meta={meta} key={idx} apiErrors={apiErrors} extraLabels={extraLabels} />
                            ))}

                            <HorizontalDivider />

                            <div className="create-form-field">
                                <Stack justify="space-between">
                                    <Button text={type === "create" ? "Create" : "Update"} onClick={() => submitForm()} loading={loading} />
                                    {type === "update" && issueKey ? (
                                        <Button text="Cancel" intent="secondary" onClick={() => navigate(`/view/${issueKey}`)} />
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
