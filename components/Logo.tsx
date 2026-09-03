import type { HTMLProps } from "react";

import Image from "next/image";
import styles from "./Logo.module.css";

export const Logo = ({
  size = 72,
} & { size?: number }) => (
    <Image
      className={styles.logo}
      src="/icons/favicon.svg"
      width={size}
      height={size}
      alt=""
    />
);
