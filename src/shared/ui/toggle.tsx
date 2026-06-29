import React from "react";
import styled from "styled-components";

function Toggle({ label, checked, onClick }) {
  const id = React.useId();

  // This style updates the UI, to move the ball
  // and indicate whether it's toggled or not.
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
  gap: 16px;
  isolation: isolate;
`;

const ToggleButton = styled.button`
  --size: 17px;
  --padding: calc(var(--size) * 0.1);
  --width: calc(var(--size) * 2 + var(--padding) * 2);
  --radius: calc(var(--size) * 0.25);
  --handle-color: var(--color-primary, white);
  --color-text: black;
  --backdrop-color: white;

  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  width: var(--width);
  padding: var(--padding);

  &::before {
    content: "";
    position: absolute;
    z-index: 0;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
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
    background: var(--color-text);
    border-radius: 10px;
  }
  &:focus-visible {
    outline: 2px auto var(--color-primary);
    outline-offset: 2px;
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
  border: 2px solid var(--color-text);
  outline: 2px solid var(--backdrop-color);
  transition: transform 400ms cubic-bezier(0.1, 0.78, 0.38, 1.06);
`;
