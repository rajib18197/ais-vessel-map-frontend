import styled from "styled-components";
import type { ReactNode } from "react";

type SidebarProps = {
  children: ReactNode;
};

export default function Sidebar({ children }: SidebarProps) {
  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.aside`
  height: 100vh;
  background: var(--color-surface-strong);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
`;
