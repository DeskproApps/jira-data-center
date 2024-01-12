export type CommentFormValues = {
  comments: string,
};

export type FormProps = {
  onSubmit: (data: CommentFormValues) => Promise<void>,
  onCancel: () => void,
};
