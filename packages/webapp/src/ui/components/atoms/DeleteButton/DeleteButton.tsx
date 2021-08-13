import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { FC } from 'react'
import './styles.scss'

export type DeleteButtonProps = {
  onClick?(arg0: unknown): unknown
  className?: string
}

export const DeleteButton: FC<DeleteButtonProps> = ({ className, onClick}) => {
  return (
    <div className={`delete-button ${className}`} onClick={onClick}>
      <CloseRoundedIcon />
    </div>
  )
}

DeleteButton.defaultProps = {
}

export default DeleteButton
