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
  innerRef?: React.LegacyRef<HTMLElement>
  onClick?: (e: React.MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
} & Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>

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
  ...abbrProps
}: SecondaryButtonProps) {
  return (
    <abbr
      ref={innerRef}
      className={`secondary-button button ${className} ${color} hover-${onHoverColor} ${
        disabled ? 'disabled' : ''
      }`}
      tabIndex={!disabled ? 0 : undefined}
      style={{ pointerEvents: noHover ? 'none' : 'unset' }}
      title={abbr}
      {...abbrProps}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        disabled
          ? undefined
          : e => {
              isEnterKeyEv(e) && onClick?.(e)
              abbrProps.onKeyDown?.(e)
            }
      }
    >
      {children}
      {hiddenText && <span className="visually-hidden">{hiddenText}</span>}
    </abbr>
  )
}
