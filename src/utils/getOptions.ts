import get from "lodash/get";
import size from "lodash/size";
import { getOption } from "./getOption";

const getOptions = <T>(items?: T[], key?: keyof T) => {
  if (!Array.isArray(items) || !size(items)) {
    return [];
  }

  return items.map((item) => {
    return getOption(get(item, ["id"]), get(item, [key || "name"]));
  });
};

export { getOptions };
