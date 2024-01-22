import { P5 } from "@deskpro/deskpro-ui";
import { useAdfToPlainText } from "../../../../../../hooks";
import { NoValue } from "../NoValue";
import type { FC } from "react";
import type { MappedViewProps } from "../types";

export const ParagraphField: FC<MappedViewProps> = ({ value }) => {
    const sdfToPlainText = useAdfToPlainText();
    return (value
        ? <P5>{sdfToPlainText(value as string)}</P5>
        : <NoValue />
    );
};
