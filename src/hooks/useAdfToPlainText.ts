import isString from "lodash/isString";
import { ADFEntity, reduce } from "@atlaskit/adf-utils";

const useAdfToPlainText = () => {
    return (document?: ADFEntity|string|null): string => {
        if (!document) {
            return "";
        }

        if (isString(document)) {
            return document;
        }

        return reduce(document, (acc, node) => {
            if (node.type === "text") {
                acc += node.text;
            }

            return acc;
        }, "");
    };
};

export { useAdfToPlainText };
