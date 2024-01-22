import { getRequestBody } from "../getRequestBody";

describe("utils", () => {
  describe("getRequestBody", () => {
    test("should return string", () => {
      expect(getRequestBody("Stepan=Bandera")).toBe("Stepan=Bandera");
      expect(getRequestBody("")).toBe("");
    });

    test("should return stringified object", () => {
      expect(getRequestBody({ "Roman": "Shukhevych" })).toBe("{\"Roman\":\"Shukhevych\"}");
    });

    test("should return FormData", () => {
      const formData = new FormData();
      formData.append("Bohdan", "Khmelnytsky");
      formData.append("Ivan", "Mazepa");
      expect(getRequestBody(formData)).toBe(formData);
    });

    test.each([undefined, null, 0, true, false])("wrong value: %p", (payload) => {
      expect(getRequestBody(payload as never)).toBeUndefined();
    });
  });
});
