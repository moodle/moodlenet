'use client'
import type { KeyboardEvent, ReactNode } from 'react'
import './PrimaryButton.scss'
import { isEnterKeyEv } from '@/lib/ui/utils/keyboard'

export type PrimaryButtonProps = {
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  color?: '' | 'green' | 'red' | 'orange' | 'grey' | 'blue' | 'card' | 'light-grey'
  onHoverColor?: '' | 'green' | 'orange' | 'red' | 'green'
  noHover?: boolean
  children?: ReactNode
  innerRef?: React.LegacyRef<HTMLElement>
  onClick?: (e: React.MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
} & Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>

export default function PrimaryButton({
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
  ...abbrProps
}: PrimaryButtonProps) {
  return (
    <abbr
      ref={innerRef}
      className={`primary-button button ${className ?? ''} ${onHoverColor ?? ''} ${
        disabled ? 'disabled' : ''
      } ${color}`}
      tabIndex={!disabled ? 0 : undefined}
      style={{ pointerEvents: noHover ? 'none' : 'unset' }}
      title={abbr}
      {...abbrProps}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        disabled
          ? undefined
          : e => {
            isEnterKeyEv(  e) && onClick?.(e)
              abbrProps.onKeyDown?.(e)
            }
      }
    >
      {children}
      {hiddenText && <span className="visually-hidden">{hiddenText}</span>}
    </abbr>
  )
}
