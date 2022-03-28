import { FC } from 'react'
import './styles.scss'

export type TertiaryButtonProps = {
  className?: string
  disabled?: boolean
  onClick?(arg0: unknown): unknown | any
}

export const TertiaryButton: FC<TertiaryButtonProps> = ({
  className,
  disabled,
  children,
  onClick,
}) => {
  return (
    <div
      className={`tertiary-button ${className}`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
    >
      {children}
    </div>
  )
}

export default TertiaryButton
