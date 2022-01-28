import { FC } from 'react'
import './styles.scss'

export type TertiaryButtonProps = {
  className?: string
  disabled?: string
}

export const TertiaryButton: FC<TertiaryButtonProps> = ({
  className,
  children,
  disabled,
}) => {
  return (
    <div
      className={`tertiary-button ${className}`}
      tabIndex={!disabled ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export default TertiaryButton
