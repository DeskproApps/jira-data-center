import { IntlProvider } from "react-intl";
import { Formik } from "formik";
import {
  Label,
  Stack,
  Button,
  FormikField,
} from "@deskpro/deskpro-ui";
import { getInitValues } from "./utils";
import { TextArea } from "../common";
import type { FC } from "react";
import type { FormProps, CommentFormValues } from "./types";

const IssueCommentForm: FC<FormProps> = ({
  onCancel,
  onSubmit,
}) => {
  return (
    <IntlProvider locale="en">
      <Formik<CommentFormValues>
        initialValues={getInitValues()}
        onSubmit={onSubmit}
      >
        {({ submitForm, values, isSubmitting }) => (
          <>
            <Stack vertical gap={12} style={{ width: "100%" }}>
              <FormikField<string> name="comments">
                {([field], { id, error }) => (
                  <Label htmlFor={id} label="New Comment" error={error}>
                    <TextArea
                      id={id}
                      {...field}
                      variant="inline"
                      minHeight="auto"
                      placeholder="Add Value"
                    />
                  </Label>
                )}
              </FormikField>

              <Stack justify="space-between" style={{ width: "100%" }}>
                <Button
                  text="Add"
                  disabled={!values.comments || isSubmitting}
                  onClick={submitForm}
                  loading={isSubmitting}
                />
                <Button
                  text="Cancel"
                  intent="secondary"
                  onClick={onCancel}
                />
              </Stack>
            </Stack>
          </>
        )}
      </Formik>
    </IntlProvider>
  );
};

export { IssueCommentForm };
