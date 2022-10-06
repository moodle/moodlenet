import { FC, ReactNode } from 'react'
import './SecondaryButton.scss'

export type SecondaryButtonProps = {
  color?: 'black' | 'orange' | 'grey' | 'red' | 'light-grey' | 'dark-blue'
  className?: string
  disabled?: boolean
  onHoverColor?: 'blue' | 'grey' | 'red' | 'fill-red'
  children?: ReactNode
  onClick?(arg0?: unknown): unknown
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  color,
  className,
  disabled,
  onHoverColor,
  onClick,
  ...props
}) => {
  return (
    <button
      className={`secondary-button button ${className} ${color} hover-${onHoverColor} ${disabled ? 'disabled' : ''}`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
      onKeyDown={e => !disabled && onClick && e.key === 'Enter' && onClick()}
      {...props}
    >
      {children}
    </button>
  )
}

SecondaryButton.defaultProps = {
  color: 'black',
}

export default SecondaryButton