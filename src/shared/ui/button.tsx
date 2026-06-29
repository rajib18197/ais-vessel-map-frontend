import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: var(--space-xs) var(--space-sm);
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: var(--space-sm) var(--space-md);
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: var(--space-sm) var(--space-lg);
    font-weight: 500;
  `,
} as const;

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
    border: 1px solid transparent;

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-text-muted);
    background: var(--color-surface);
    border: 1px solid var(--color-border);

    &:hover {
      background-color: var(--color-surface-strong);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
} as const;

type ButtonSize = keyof typeof sizes;
type ButtonVariation = keyof typeof variations;

type ButtonProps = {
  size?: ButtonSize;
  variation?: ButtonVariation;
};

const Button = styled.button.attrs<ButtonProps>(() => ({
  variation: "primary",
  size: "medium",
}))<ButtonProps>`
  border: none;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ size = "medium" }) => sizes[size]}
  ${({ variation = "primary" }) => variations[variation]}

  &:focus-visible {
    outline: 3px solid var(--color-brand-600);
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export default Button;
