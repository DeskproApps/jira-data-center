import React, { FC } from "react";
import { H3 } from "@deskpro/deskpro-ui";

export type Props = {
  text?: string,
};

const NoFound: FC<Props> = ({ text = "No found" } = {}) => (
  <H3>{text}</H3>
);

export { NoFound };
