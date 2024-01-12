import { cleanup } from "@testing-library/react";
import { ErrorBlock } from "../ErrorBlock";
import { render } from "../../../../../testing";
import type { Props } from "../ErrorBlock";

const renderErrorBlock = (props?: Partial<Props>) => render((
  <ErrorBlock text={props?.text}/>
), { wrappers: { theme: true } });

describe("ErrorBlock", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should render error", async () => {
    const { findByText } = renderErrorBlock();
    expect(await findByText(/There was an error!/i)).toBeInTheDocument();
  });

  test("should render errors", async () => {
    const { findByText } = renderErrorBlock({ text: ["one error", "two error"] });
    expect(await findByText(/one error/i)).toBeInTheDocument();
    expect(await findByText(/two error/i)).toBeInTheDocument();
  });
});
