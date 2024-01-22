import styled from "styled-components";
import { TSpan } from "@deskpro/deskpro-ui";
import type { FC, PropsWithChildren } from "react";
import type { TProps } from "@deskpro/deskpro-ui";

type Props = PropsWithChildren<Omit<TProps, "type">> & {
  type?: TProps["type"],
};

const SecondaryStyled = styled(TSpan)`
  color: ${({ theme }) => theme.colors.grey100};
`;

const Secondary: FC<Props> = ({ type = "p5", ...props }) => (
  <SecondaryStyled type={type} {...props} />
);

export { Secondary };
