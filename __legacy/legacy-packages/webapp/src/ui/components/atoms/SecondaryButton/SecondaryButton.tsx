import { FC } from 'react'
import './styles.scss'

export type SecondaryButtonProps = {
  color?: 'black' | 'orange' | 'grey' | 'red' | 'light-grey' | 'dark-blue'
  className?: string
  disabled?: boolean
  onHoverColor?: 'blue' | 'grey' | 'red' | 'fill-red'
  onClick?(arg0?: unknown): unknown
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  color,
  className,
  disabled,
  onHoverColor,
  onClick,
}) => {
  return (
    <div
      className={`secondary-button button ${className} ${color} hover-${onHoverColor} ${
        disabled ? 'disabled' : ''
      }`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
      onKeyDown={(e) => !disabled && onClick && e.key === 'Enter' && onClick()}
    >
      {children}
    </div>
  )
}

SecondaryButton.defaultProps = {
  color: 'black',
}

export default SecondaryButton
