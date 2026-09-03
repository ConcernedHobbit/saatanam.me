import type { HTMLProps } from "react";

import Image from "next/image";
import styles from "./Logo.module.css";

export const Logo = ({
  size = 72,
  ...props
}: HTMLProps<HTMLDivElement> & { size?: number }) => (
  <div {...props}>
    <Image
      className={styles.logo}
      src="/icons/favicon.svg"
      width={size}
      height={size}
      alt=""
    />
  </div>
);
