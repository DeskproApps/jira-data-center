import { addBlankTargetToLinks } from "../addBlankTargetToLinks";

describe("utils", () => {
  describe("addBlankTargetToLinks", () => {
    test("should added target=_blank to the link", () => {
      const htmlString = `<a href="https://www.google.com">Google</a>`;
      const modifiedString = `<a href="https://www.google.com" target="_blank">Google</a>`;

      expect(addBlankTargetToLinks(htmlString)).toContain(modifiedString);
    });
  });
});
