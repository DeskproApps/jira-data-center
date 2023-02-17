import { ADFEntity, reduce } from "@atlaskit/adf-utils";

const useAdfToAnchoredText = () => {
    return (document: ADFEntity): string => {
        if (!document) {
            return "";
        }

        return reduce(document, (acc, node) => {
            if (node.type === "text") {

                if (node?.marks) {
                    const links = (node.marks ?? []).filter((m) => m.type === "link")[0];
                    if (links && links.attrs?.href) {
                        acc += `<a href="${links.attrs.href}" target="_blank">${node.text}</a>`;
                        return acc;
                    }
                }

                acc += node.text;
            }

            return acc;
        }, "");
    };
};

export { useAdfToAnchoredText };
