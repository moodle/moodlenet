import { FC, ReactNode } from 'react'
import './styles.scss'

export type TertiaryButtonProps = {
  className?: string
  abbr?: string
  disabled?: boolean
  children?: ReactNode
  onClick?(arg0?: unknown): unknown | any
}

export const TertiaryButton: FC<TertiaryButtonProps> = ({
  className,
  disabled,
  abbr,
  children,
  onClick,
}) => {
  return (
    <abbr
      className={`tertiary-button ${className} ${disabled ? 'disabled' : ''}`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
      title={abbr}
      onKeyDown={(e) => !disabled && onClick && e.key === 'Enter' && onClick()}
    >
      {children}
    </abbr>
  )
}

export default TertiaryButton
