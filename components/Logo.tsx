import type { HTMLProps } from "react";

import Image from "next/image";

export const Logo = ({
  size = 72,
  ...props
}: HTMLProps<HTMLDivElement> & { size?: number }) => (
  <div {...props}>
    <Image
      src="/color.png"
      width={size}
      height={size}
      alt=""
    />
  </div>
);
