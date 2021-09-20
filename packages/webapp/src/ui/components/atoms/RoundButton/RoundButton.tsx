import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import { FC } from 'react';
import './styles.scss';

export type RoundButtonProps = {
  onClick?(arg0: unknown): unknown
  className?: string
  type?: 'cross' | 'trash' |'edit'
  onHoverColor?: 'red'
}

export const RoundButton: FC<RoundButtonProps> = ({ className, type, onHoverColor, onClick}) => {
  return (
    <div className={`round-button ${className} hover-${onHoverColor}`} onClick={onClick}>
      { type === 'cross' && <CloseRoundedIcon />}
      { type === 'trash' && <DeleteOutlineIcon />}
      { type === 'edit' && <EditIcon />}
    </div>
  )
}

RoundButton.defaultProps = {
  type: 'cross'
}

export default RoundButton
