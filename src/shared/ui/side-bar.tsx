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
  background: hsl(210deg 19% 9%/1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
