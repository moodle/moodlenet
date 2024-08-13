"use client"
import type { FC, KeyboardEvent, ReactNode } from 'react'
import './TertiaryButton.scss'
import { isEnterKeyEv } from '@/lib/ui/utils/keyboard'

export type TertiaryButtonProps = {
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  children: ReactNode
  color?: 'black'
  onClick?: (e: React.MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
}& Omit<React.HTMLAttributes<HTMLElement>, 'onClick'>

export const TertiaryButton: FC<TertiaryButtonProps> = ({
  className,
  abbr,
  hiddenText,
  disabled,
  children,
  color,
  onClick,
  ...abbrProps
}) => {
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
             isEnterKeyEv(  e)&& onClick?.(e)
              abbrProps.onKeyDown?.(e)
            }
      }
    >
      {children}
      {hiddenText && <span className="visually-hidden">{hiddenText}</span>}
    </abbr>
  )
}

export default TertiaryButton
