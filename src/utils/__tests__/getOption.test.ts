import { getOption } from "../getOption";

describe("utils", () => {
  describe("getOption", () => {
    test("should make a option item", () => {
      expect(getOption("optionID", "optionLabel")).toEqual({
        label: "optionLabel",
        value: "optionID",
        key: "optionID",
        type: "value",
      });
    });
  });
});
