import type { HTMLProps } from "react";

import Image from "next/image";
import styles from "./Logo.module.css";

export const Logo = ({
  size = 72,
  ...props
}: HTMLProps<HTMLAnchorElement> & { size?: number }) => (
  <></>
);
