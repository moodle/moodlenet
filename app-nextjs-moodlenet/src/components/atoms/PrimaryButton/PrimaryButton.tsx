'use client'
import type { ReactNode } from 'react'
import './PrimaryButton.scss'

export type PrimaryButtonProps = {
  onClick?(arg0?: unknown): unknown
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  color?: '' | 'green' | 'red' | 'orange' | 'grey' | 'blue' | 'card' | 'light-grey'
  onHoverColor?: '' | 'green' | 'orange' | 'red' | 'green'
  noHover?: boolean
  children?: ReactNode
  innerRef?: React.LegacyRef<HTMLElement>
} & React.HTMLAttributes<HTMLElement>

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
  ...props
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
      onClick={!disabled ? onClick : () => null}
      onKeyDown={e => !disabled && onClick && e.key === 'Enter' && onClick()}
      {...props}
    >
      {children}
      {hiddenText && <span className="visually-hidden">{hiddenText}</span>}
    </abbr>
  )
}
