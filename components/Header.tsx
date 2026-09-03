import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { Logo } from "./Logo";

export type HeaderProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & { children: ReactNode, logo?: boolean };

export const Header = ({ children, style, logo = true, ...props }: HeaderProps) => (
  <header
    style={{
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      height: "5rem",
      ...style,
    }}
    {...props}
  >
    {children}
    {logo && <Logo key="header-logo" style={{ marginLeft: "auto" }} />}
  </header>
);
