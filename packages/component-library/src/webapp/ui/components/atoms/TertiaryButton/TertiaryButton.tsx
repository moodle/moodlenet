import { FC, ReactNode } from 'react'
import './TertiaryButton.scss'

export type TertiaryButtonProps = {
  className?: string
  disabled?: boolean
  children: ReactNode
  color?: 'black'
  onClick?(arg0?: unknown): unknown | any
}

export const TertiaryButton: FC<TertiaryButtonProps> = ({ className, disabled, children, color, onClick }) => {
  return (
    <div
      className={`tertiary-button ${className} ${disabled ? 'disabled' : ''} ${color ? color : ''}`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
      onKeyDown={e => !disabled && onClick && e.key === 'Enter' && onClick()}
    >
      {children}
    </div>
  )
}

export default TertiaryButton
