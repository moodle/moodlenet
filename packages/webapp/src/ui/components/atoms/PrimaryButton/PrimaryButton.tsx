import { FC } from 'react'
import './styles.scss'

export type PrimaryButtonProps = {
  onClick?(arg0: unknown): unknown
  className?: string
  disabled?: boolean
  color?: 'default' | 'green'
  onHoverColor?: 'default' | 'green' | 'orange'
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ children, className, color, onHoverColor, onClick, disabled }) => {
  return (
    <div className={`primary-button button ${className} ${disabled ? 'disabled' : ''} ${color} hover-${onHoverColor}`} onClick={onClick}>
      {children}
    </div>
  )
}

PrimaryButton.defaultProps = {
  color: 'default',
  onHoverColor: 'default'
}

export default PrimaryButton
