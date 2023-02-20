import { FC, ReactNode } from 'react'
import './TertiaryButton.scss'

export type TertiaryButtonProps = {
  className?: string
  abbr?: string
  disabled?: boolean
  children: ReactNode
  color?: 'black'
  onClick?(arg0?: unknown): unknown | any
}

export const TertiaryButton: FC<TertiaryButtonProps> = ({
  className,
  abbr,
  disabled,
  children,
  color,
  onClick,
}) => {
  return (
    <abbr
      className={`tertiary-button ${className} ${disabled ? 'disabled' : ''}  ${
        abbr ? 'abbr' : ''
      } ${color ? color : ''}`}
      title={abbr}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => undefined}
      onKeyDown={e => !disabled && onClick && e.key === 'Enter' && onClick()}
    >
      {children}
    </abbr>
  )
}

export default TertiaryButton
