import { cleanup } from "@testing-library/react";
import { baseRequest } from "../baseRequest";
import { searchIssues } from "../searchIssues";
import mockSearchIssues from "./mockSearchIssues.json";
import mockIssuesPicker from "./mockIssuesPicker.json";
import { mockClient } from "../../../../testing";

jest.mock("../baseRequest");

describe("api", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe("searchIssues", () => {
    test("should return searching issue", async () => {
      (baseRequest as jest.Mock)
        .mockResolvedValueOnce(mockIssuesPicker)
        .mockResolvedValueOnce(mockSearchIssues);

      const result = await searchIssues(mockClient as never, "issue");

      expect(result).toMatchObject([{ "key": "DKA-18" }, { "key": "DKA-17" }]);
    });
  });
});
