import type { FC } from "react";
import type { MappedViewProps } from "../types";
import { NoValue } from "../NoValue";
import { useAdfToPlainText } from "../../../../../../hooks";

export const ParagraphField: FC<MappedViewProps> = ({ value }) => {
    const sdfToPlainText = useAdfToPlainText();
    return (value
        ? <>{sdfToPlainText(value as string)}</>
        : <NoValue />
    );
};
