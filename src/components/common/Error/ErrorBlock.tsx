import styled from "styled-components";
import { P5 } from "@deskpro/deskpro-ui";
import { DEFAULT_ERROR } from "../../../constants";
import type { FC, JSX } from "react";
import type { Maybe } from "../../../types";

export type Props = {
  text?: Maybe<string|JSX.Element|Array<string|JSX.Element>>,
}

const StyledErrorBlock = styled(P5)`
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.red100};
`;

const ErrorBlock: FC<Props> = ({ text = DEFAULT_ERROR }) => (
  <>
    {Array.isArray(text)
      ? text.map((msg, idx) => (<StyledErrorBlock key={idx}>{msg}</StyledErrorBlock>))
      : <StyledErrorBlock>{text}</StyledErrorBlock>
    }
  </>
);

export { ErrorBlock };
