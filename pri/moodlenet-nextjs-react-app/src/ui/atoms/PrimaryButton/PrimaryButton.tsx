'use client'
import type { KeyboardEvent, ReactNode } from 'react'
import { isEnterKeyEv } from '../../lib/keyboard'
import './PrimaryButton.scss'

export type PrimaryButtonProps = {
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  color?: '' | 'green' | 'red' | 'orange' | 'grey' | 'blue' | 'card' | 'light-grey'
  onHoverColor?: '' | 'green' | 'orange' | 'red' | 'green'
  noHover?: boolean
  children?: ReactNode
  innerRef?: React.LegacyRef<HTMLButtonElement>
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>

export function PrimaryButton({
  children,
  className,
  abbr,
  hiddenText,
  color = '',
  onHoverColor = '',
  noHover,
  disabled,
  onClick,
  innerRef,
  ...buttonProps
}: PrimaryButtonProps) {
  return (
    <button
      ref={innerRef}
      className={`primary-button button ${className ?? ''} ${onHoverColor ?? ''} ${
        disabled ? 'disabled' : ''
      } ${color}`}
      tabIndex={!disabled ? 0 : undefined}
      style={{ pointerEvents: noHover ? 'none' : 'unset' }}
      title={abbr}
      {...buttonProps}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        disabled
          ? undefined
          : e => {
              isEnterKeyEv(e) && onClick?.(e)
              buttonProps.onKeyDown?.(e)
            }
      }
    >
      {children}
      {hiddenText && <span className="visually-hidden">{hiddenText}</span>}
    </button>
  )
}
