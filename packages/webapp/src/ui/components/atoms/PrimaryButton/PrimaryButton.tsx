import { FC } from 'react'
import './styles.scss'

export type PrimaryButtonProps = {
  onClick?(): unknown
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ children, onClick }) => {
  return (
    <div className="primary-button" onClick={onClick}>
      {children}
    </div>
  )
}

export default PrimaryButton
