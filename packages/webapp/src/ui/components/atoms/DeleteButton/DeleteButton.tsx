import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { FC } from 'react';
import './styles.scss';

export type DeleteButtonProps = {
  onClick?(arg0: unknown): unknown
  className?: string
  type?: 'cross' | 'trash'
  onHoverColor?: 'red'
}

export const DeleteButton: FC<DeleteButtonProps> = ({ className, type, onHoverColor, onClick}) => {
  return (
    <div className={`delete-button ${className} hover-${onHoverColor}`} onClick={onClick}>
      { type === 'cross' && <CloseRoundedIcon />}
      { type === 'trash' && <DeleteOutlineIcon />}
    </div>
  )
}

DeleteButton.defaultProps = {
  type: 'cross'
}

export default DeleteButton
