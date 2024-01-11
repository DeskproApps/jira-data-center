import has from "lodash/has";
import type { Maybe, ElementEventPayload, NavigateToChangePage } from "../types";

const isNavigatePayload = (
  payload?: Maybe<ElementEventPayload>,
): payload is NavigateToChangePage => {
  return has(payload, ["path"]);
};

export { isNavigatePayload };
