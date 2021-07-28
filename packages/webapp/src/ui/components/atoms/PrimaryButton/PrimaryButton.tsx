import { FC } from 'react'
import './styles.scss'

export type PrimaryButtonProps = {
  onClick?(arg0: unknown): unknown
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ children, onClick }) => {
  return (
    <div className="primary-button" onClick={onClick}>
      {children}
    </div>
  )
}

export default PrimaryButton
