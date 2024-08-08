"use client"
import type { FC, ReactNode } from 'react'
import './TertiaryButton.scss'

export type TertiaryButtonProps = {
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  children: ReactNode
  color?: 'black'
  onClick?(arg0?: unknown): unknown
}

export const TertiaryButton: FC<TertiaryButtonProps> = ({
  className,
  abbr,
  hiddenText,
  disabled,
  children,
  color,
  onClick,
}) => {
  return (
    <abbr
      className={`tertiary-button ${className ?? undefined} ${disabled ? 'disabled' : ''}  ${
        abbr ? 'abbr' : ''
      } ${color ? color : ''}`}
      title={abbr}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => undefined}
      onKeyDown={e => !disabled && onClick && e.key === 'Enter' && onClick()}
    >
      {children}
      {hiddenText && <span className="visually-hidden">{hiddenText}</span>}
    </abbr>
  )
}

export default TertiaryButton
