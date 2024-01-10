import { cleanup } from "@testing-library/react";
import { render } from "../../../../../testing";
import { NoFoundIssues } from "../NoFoundIssues";
import type { Props } from "../NoFoundIssues";

const renderNoFoundIssues = (props?: Partial<Props>) => render((
  <NoFoundIssues
    issues={props?.issues as never}
    children={props?.children || "" as never}
  />
), { wrappers: { theme: true } });

describe("NoFoundIssues", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = renderNoFoundIssues();
    expect(await findByText(/No found/i)).toBeInTheDocument();
  });

  test("should show \"No Space issues found\" if no issues", async () => {
    const { findByText } = renderNoFoundIssues({ issues: [] });
    expect(await findByText(/No Space issues found/i)).toBeInTheDocument();
  });

  test("should show passing \"children\" if issues exist", async () => {
    const { findByText } = renderNoFoundIssues({
      issues: [{ id: "001" }] as never[],
      children: () => "Some content",
    });

    expect(await findByText(/Some content/i)).toBeInTheDocument();
  });
});
