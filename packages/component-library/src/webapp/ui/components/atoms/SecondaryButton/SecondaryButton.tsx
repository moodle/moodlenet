import type { FC, ReactNode } from 'react'
import './SecondaryButton.scss'

export type SecondaryButtonProps = {
  color?: 'black' | 'orange' | 'grey' | 'red' | 'light-grey' | 'dark-blue'
  className?: string
  abbr?: string
  hiddenText?: string
  disabled?: boolean
  onHoverColor?: 'blue' | 'grey' | 'red' | 'fill-red'
  noHover?: boolean
  children?: ReactNode
  innerRef?: React.RefObject<HTMLElement>
  onClick?(arg0?: unknown): unknown
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  color,
  className,
  abbr,
  hiddenText,
  disabled,
  onHoverColor,
  noHover,
  innerRef,
  onClick,
  ...props
}) => {
  return (
    <abbr
      className={`secondary-button button ${className} ${color} hover-${onHoverColor} ${
        disabled ? 'disabled' : ''
      }`}
      ref={innerRef}
      title={abbr}
      tabIndex={!disabled ? 0 : undefined}
      style={{ pointerEvents: noHover ? 'none' : 'unset' }}
      onClick={!disabled ? onClick : () => undefined}
      onKeyDown={e => !disabled && onClick && e.key === 'Enter' && onClick()}
      {...props}
    >
      {children}
      {hiddenText && <span className="visually-hidden">{hiddenText}</span>}
    </abbr>
  )
}

SecondaryButton.defaultProps = {
  color: 'black',
}

export default SecondaryButton
