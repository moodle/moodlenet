import { FC } from 'react'
import './styles.scss'

export type PrimaryButtonProps = {
  onClick?(arg0?: unknown): unknown | any
  className?: string
  disabled?: boolean
  color?: '' | 'green' | 'red' | 'grey' | 'blue' | 'card' | 'light-gray'
  onHoverColor?: '' | 'green' | 'orange' | 'red' | 'green'
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  className,
  color,
  onHoverColor,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={`primary-button button ${className} ${onHoverColor} ${
        disabled ? 'disabled' : ''
      } ${color}`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
      onKeyDown={(e) => !disabled && onClick && e.key === 'Enter' && onClick()}
    >
      {children}
    </div>
  )
}

PrimaryButton.defaultProps = {
  color: '',
  onHoverColor: '',
}

export default PrimaryButton
