import { Fragment } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import { Comment } from "../../common";
import type { FC } from "react";
import type { Maybe } from "../../../types";
import type { JiraComment } from "../../../context/StoreProvider/types";

type Props = {
  comments?: Maybe<JiraComment[]>,
  onNavigateToAddComment: () => void,
}

const Comments: FC<Props> = ({ comments, onNavigateToAddComment }) => {
    return (
        <>
          <Title
            title={`Comments (${size(comments)})`}
            onClick={onNavigateToAddComment}
          />
          {(comments || []).map((comment) => (
            <Fragment key={comment.id}>
              <Comment
                name={get(comment, ["author", "displayName"])}
                text={get(comment, ["renderedBody"])}
                date={new Date(get(comment, ["created"]))}
              />
              <HorizontalDivider style={{ marginBottom: 10 }} />
            </Fragment>
          ))}
        </>
    );
};

export { Comments };
