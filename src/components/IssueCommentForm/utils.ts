import type { CommentFormValues } from "./types";

const getInitValues = (): CommentFormValues => {
  return {
    comments: "",
  };
};

export { getInitValues };
