import { FC, ReactNode } from 'react'
import './PrimaryButton.scss'

export type PrimaryButtonProps = {
  onClick?(arg0?: unknown): unknown | any
  className?: string
  disabled?: boolean
  color?: '' | 'green' | 'red' | 'grey' | 'blue' | 'card' | 'light-gray'
  onHoverColor?: '' | 'green' | 'orange' | 'red' | 'green'
  children?: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  className,
  color,
  onHoverColor,
  disabled,
  onClick,
  ...props
}) => {
  return (
    <button
      className={`primary-button button ${className} ${onHoverColor} ${disabled ? 'disabled' : ''} ${color}`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
      onKeyDown={e => !disabled && onClick && e.key === 'Enter' && onClick()}
      {...props}
    >
      {children}
    </button>
  )
}

PrimaryButton.defaultProps = {
  color: '',
  onHoverColor: '',
}

export default PrimaryButton
