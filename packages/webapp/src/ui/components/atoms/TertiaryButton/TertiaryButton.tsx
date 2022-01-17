import { FC } from 'react'
import './styles.scss'

export type TertiaryButtonProps = {
  className?: string
}

export const TertiaryButton: FC<TertiaryButtonProps> = ({
  className,
  children,
}) => {
  return <div className={`tertiary-button ${className}`}>{children}</div>
}

export default TertiaryButton
