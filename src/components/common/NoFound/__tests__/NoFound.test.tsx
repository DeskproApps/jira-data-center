import { cleanup } from "@testing-library/react";
import { render } from "../../../../../testing";
import { NoFound } from "../NoFound";
import type { Props } from "../NoFound";

const renderNoFound = (props?: Partial<Props>) => render((
  <NoFound text={props?.text} />
), { wrappers: { theme: true } });

describe("NoFound", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = renderNoFound();
    expect(await findByText(/No found/i)).toBeInTheDocument();
  });

  test("should show \"Nothing found message\" if pass text", async () => {
    const { findByText } = renderNoFound({ text: "Nothing found message" });
    expect(await findByText(/Nothing found message/i)).toBeInTheDocument();
  });
});
