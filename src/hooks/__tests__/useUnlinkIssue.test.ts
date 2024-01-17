import { cleanup, renderHook, act } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { deleteEntityService } from "../../services/deskpro";
import { removeRemoteLink } from "../../services/jira";
import { useUnlinkIssue } from "../useUnlinkIssue";
import type { Result } from "../useUnlinkIssue";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock("../useAsyncError", () => ({
  useAsyncError: jest.fn().mockReturnValue({ asyncErrorHandler: jest.fn() }),
}));
jest.mock("../../services/deskpro/deleteEntityService");
jest.mock("../../services/jira/removeRemoteLink");

const renderUseUnlinkIssue = () => renderHook<Result, unknown>(() => useUnlinkIssue());

describe("hooks", () => {
  describe("useUnlinkIssue", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("should unlink issue", async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
      (deleteEntityService as jest.Mock).mockResolvedValueOnce(undefined);
      (removeRemoteLink as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderUseUnlinkIssue();

      await act(async () => {
        await result.current.unlink("DP-001" as never);
      })

      expect(deleteEntityService).toHaveBeenCalled();
      expect(removeRemoteLink).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    test("shouldn't navigate to /home if unlink issue failed", async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
      (deleteEntityService as jest.Mock).mockRejectedValueOnce(new Error("unlink failed"));
      (removeRemoteLink as jest.Mock).mockResolvedValueOnce(undefined);

      const {result} = renderUseUnlinkIssue();

      await act(async () => {
        await result.current.unlink("DP-001" as never);
      });

      expect(deleteEntityService).toHaveBeenCalled();
      expect(removeRemoteLink).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalledWith("/home");
    });

    test("shouldn't navigate to /home if no issueKey", async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
      (deleteEntityService as jest.Mock).mockResolvedValueOnce(undefined);
      (removeRemoteLink as jest.Mock).mockResolvedValueOnce(undefined);

      const {result} = renderUseUnlinkIssue();

      await act(async () => {
        await result.current.unlink(undefined as never);
      });

      expect(deleteEntityService).not.toHaveBeenCalled();
      expect(removeRemoteLink).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalledWith("/home");
    });
  });
});
