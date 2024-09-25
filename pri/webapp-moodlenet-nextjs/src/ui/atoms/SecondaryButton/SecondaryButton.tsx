'use client'
import type { KeyboardEvent, ReactNode } from 'react'
import { isEnterKeyEv } from '../../lib/keyboard'
import './SecondaryButton.scss'

export type SecondaryButtonProps = {
  color?: 'black' | 'orange' | 'grey' | 'red' | 'light-grey' | 'dark-blue'
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  onHoverColor?: 'blue' | 'grey' | 'red' | 'fill-red'
  noHover?: boolean
  children?: ReactNode
  innerRef?: React.LegacyRef<HTMLButtonElement>
  onClick?: (e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>

export function SecondaryButton({
  children,
  color = 'black',
  className,
  abbr,
  hiddenText,
  disabled,
  onHoverColor,
  noHover,
  innerRef,
  onClick,
  ...buttonProps
}: SecondaryButtonProps) {
  return (
    <button
      ref={innerRef}
      className={`secondary-button button ${className} ${color} hover-${onHoverColor} ${
        disabled ? 'disabled' : ''
      }`}
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
