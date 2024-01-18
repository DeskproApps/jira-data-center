import { getApiError } from "../getApiError";
import { JiraError } from "../../services/jira/JiraError";
import { DEFAULT_ERROR } from "../../constants";

const mockError1 = new JiraError({
  status: 100500,
  data: {
    errors:{},
    errorMessages: ["gh.epic.error.not.found"],
  },
});

const mockError2 = new JiraError({
  status: 100500,
  data: {
    errors: { "customfield_10104": "Epic Name is required." },
    errorMessages: [],
  },
});

describe("utils", () => {
  describe("getApiError", () => {
    test("should return error message(s)", () => {
      expect(getApiError(mockError1 as never)).toStrictEqual("gh.epic.error.not.found");
      expect(getApiError(mockError2 as never)).toStrictEqual(mockError2.data?.errors);
    });

    test("should return default message if pass default Error object", () => {
      expect(getApiError(new Error("some error") as never)).toStrictEqual(DEFAULT_ERROR);
    });

    test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
      expect(getApiError(payload as never)).toBe(DEFAULT_ERROR);
    });
  });
});
