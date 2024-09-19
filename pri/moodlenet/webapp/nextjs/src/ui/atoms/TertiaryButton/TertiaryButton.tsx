'use client'
import type { KeyboardEvent, ReactNode } from 'react'
import { isEnterKeyEv } from '../../lib/keyboard'
import './TertiaryButton.scss'

export type TertiaryButtonProps = {
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  children: ReactNode
  color?: 'black'
  onClick?: (e: React.MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
} & Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>

export function TertiaryButton({
  className,
  abbr,
  hiddenText,
  disabled,
  children,
  color,
  onClick,
  ...abbrProps
}: TertiaryButtonProps) {
  return (
    <abbr
      className={`tertiary-button ${className ?? undefined} ${disabled ? 'disabled' : ''}  ${
        abbr ? 'abbr' : ''
      } ${color ? color : ''}`}
      title={abbr}
      tabIndex={!disabled ? 0 : undefined}
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

