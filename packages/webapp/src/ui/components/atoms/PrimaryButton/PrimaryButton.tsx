import { FC } from 'react'
import './styles.scss'

export type PrimaryButtonProps = {
  onClick?(arg0: unknown): unknown
  disabled?: boolean
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <div className={`primary-button button ${disabled ? 'disabled' : ''}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default PrimaryButton
