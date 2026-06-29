import React from "react";
import styled from "styled-components";

type ToggleProps = {
  label: string;
  checked: boolean;
  onClick: () => void;
};

function Toggle({ label, checked, onClick }: ToggleProps) {
  const id = React.useId();

  const ballStyle = {
    transform: checked ? `translateX(100%)` : `translateX(0%)`,
  };

  return (
    <Wrapper>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <ToggleButton
        id={id}
        type="button"
        aria-pressed={checked}
        onClick={onClick}
      >
        <Ball style={ballStyle} />
      </ToggleButton>
    </Wrapper>
  );
}

export default Toggle;

const Wrapper = styled.div`
  display: flex;
  gap: var(--space-sm);
  isolation: isolate;
  align-items: center;
  color: var(--color-text);
`;

const ToggleButton = styled.button`
  --size: 17px;
  --padding: calc(var(--size) * 0.12);
  --width: calc(var(--size) * 2 + var(--padding) * 2);
  --radius: calc(var(--size) * 0.45);
  --handle-color: var(--color-accent);
  --color-text: var(--color-surface);
  --backdrop-color: var(--color-surface-strong);

  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  position: relative;
  width: var(--width);
  padding: var(--padding);
  border-radius: calc(var(--size) * 0.8);

  &::before {
    content: "";
    position: absolute;
    z-index: 0;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: calc(var(--size) * 1.3);
  }

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    top: 0;
    left: var(--radius);
    right: var(--radius);
    bottom: 0;
    margin: auto;
    height: 2px;
    background: var(--color-text-muted);
    border-radius: 10px;
  }

  &:focus-visible {
    outline: 2px auto var(--color-brand-600);
    outline-offset: 3px;
  }
`;

const Ball = styled.span`
  display: flex;
  position: relative;
  z-index: 2;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: var(--handle-color);
  border: 2px solid var(--color-surface);
  outline: 2px solid var(--backdrop-color);
  transition: transform 400ms cubic-bezier(0.1, 0.78, 0.38, 1.06);
`;
