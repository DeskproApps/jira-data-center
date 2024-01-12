import { getQueryParams } from "../getQueryParams";

describe("utils", () => {
  describe("getQueryParams", () => {
    test.each([
      [undefined, ""],
      ["foo=bar", "foo=bar"],
      ["?foo=bar", "?foo=bar"],
      [[["type", "success"]], "type=success"],
      [[["type", "success"], ["foo", "bar"]], "type=success&foo=bar"],
      [{type: "error"}, "type=error"],
      [{type: "error", armen: "tamzarian"}, "type=error&armen=tamzarian"],
    ])("should %p", (receive, expected) => {
      expect(getQueryParams(receive as never)).toStrictEqual(expected);
    });

    test("should return form as string", () => {
      const form = new FormData();
      form.append("grant_type", "authorization_code");
      form.append("client_id", "123456");
      form.append("client_secret", "654321");

      expect(getQueryParams(form as never))
        .toStrictEqual("grant_type=authorization_code&client_id=123456&client_secret=654321");
    });

    test("should return string even if pass empty form", () => {
      const form = new FormData();
      expect(getQueryParams(form as never)).toStrictEqual("");
    });
  });
});
