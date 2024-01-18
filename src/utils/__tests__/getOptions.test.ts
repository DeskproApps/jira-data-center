import { getOptions } from "../getOptions";

const mockData = [
  {
    id: "2rOkEs3gWjCg",
    name: "Deskpro Apps",
    fullname: "[MAIN] Deskpro Apps",
  },
  {
    id: "kUysu1ZlRBm",
    name: "Deskpro Space",
    fullname: "[DP-SPACE] Deskpro Space",
  }
];

describe("utils", () => {
  describe("getOptions", () => {
    test("should return options", () => {
      expect(getOptions(mockData)).toStrictEqual([
        {
          key: "2rOkEs3gWjCg",
          label: "Deskpro Apps",
          type: "value",
          value: "2rOkEs3gWjCg",
        },
        {
          key: "kUysu1ZlRBm",
          label: "Deskpro Space",
          type: "value",
          value: "kUysu1ZlRBm",
        },
      ]);
    });

    test("should return options with key", () => {
      expect(getOptions(mockData, "fullname"))
        .toStrictEqual([
          {
            key: "2rOkEs3gWjCg",
            label: "[MAIN] Deskpro Apps",
            type: "value",
            value: "2rOkEs3gWjCg",
          },
          {
            key: "kUysu1ZlRBm",
            label: "[DP-SPACE] Deskpro Space",
            type: "value",
            value: "kUysu1ZlRBm",
          },
        ]);
    });

    test.each(
      [undefined, null, "", 0, true, false, {}],
    )("wrong value: %p", (value) => {
      expect(getOptions(value as never)).toStrictEqual([]);
    });
  });
});
