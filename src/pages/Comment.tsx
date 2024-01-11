import {FC, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useSetAppTitle, useRegisterElements} from "../hooks";
import {
    Label,
    Stack,
    Button,
    TextArea,
    FormikField,
} from "@deskpro/deskpro-ui";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import {useStore} from "../context/StoreProvider/hooks";
import {IntlProvider} from "react-intl";
import { Formik } from "formik";
import {addIssueComment, getIssueComments} from "../context/StoreProvider/api";

interface CommentFormValues {
    comments: string;
}

export const Comment: FC = () => {
    const navigate = useNavigate();
    const { issueKey } = useParams();
    const { client } = useDeskproAppClient();
    const [, dispatch] = useStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useSetAppTitle("Add Comment");

    useRegisterElements(({ registerElement }) => {
      registerElement("refresh", { type: "refresh_button" });
      registerElement("home", {
        type: "home_button",
        payload: { type: "changePage", path: "/home" },
      });
    }, [issueKey]);

    const initialValues: CommentFormValues = {
        comments: "",
    };

    const submit = (data: CommentFormValues) => {
        if (!client || !issueKey) {
            return;
        }

        setIsLoading(true);

        addIssueComment(client, issueKey, data.comments)
            .then(() => getIssueComments(client, issueKey))
            .then((comments) => dispatch({ type: "issueComments", key: issueKey, comments }))
            .then(() => navigate(`/view/${issueKey}`))
            .finally(() => setIsLoading(false))
        ;
    };

    return (
        <>
            <IntlProvider locale="en">
                <Formik<CommentFormValues>
                    initialValues={initialValues}
                    onSubmit={submit}
                >
                    {({ submitForm, values }) => (
                        <>
                            <Stack vertical gap={12} style={{ width: "100%" }}>
                                <FormikField<string> name="comments">
                                    {([field], { id, error }) => (
                                        <Label
                                            htmlFor={id}
                                            label="New Comment"
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
                                <Stack justify="space-between" style={{ width: "100%" }}>
                                    <Button
                                        text="Add"
                                        disabled={!values.comments}
                                        onClick={submitForm}
                                        loading={isLoading}
                                    />
                                    <Button
                                        text="Cancel"
                                        intent="secondary"
                                        onClick={() => navigate(`/view/${issueKey}`)}
                                    />
                                </Stack>
                            </Stack>
                        </>
                    )}
                </Formik>
            </IntlProvider>
        </>
    );
};
