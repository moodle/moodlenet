import { FC } from 'react'
import './styles.scss'

export type TertiaryButtonProps = {}

export const TertiaryButton: FC<TertiaryButtonProps> = ({ children }) => {
  return <div className="tertiary-button">{children}</div>
}

export default TertiaryButton
