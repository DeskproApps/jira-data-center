import { isForm } from "../isForm";

describe("utils", () => {
  describe("isForm", () => {
    test("should form", () => {
      const form = new FormData();
      form.append("grant_type", "authorization_code");
      form.append("client_id", "123456");
      form.append("client_secret", "654321");

      expect(isForm(form)).toBeTruthy();
    });

    test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
      expect(isForm(payload as never)).toBeFalsy();
    });
  });
});
