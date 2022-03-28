import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import { FC } from 'react'
import './styles.scss'

export type RoundButtonProps = {
  onClick?(arg0: unknown): unknown
  onKeyUp?: { key: string; func: () => void }
  className?: string
  tabIndex?: number
  type?: 'cross' | 'trash' | 'edit'
  color?: 'gray' | 'red'
  onHoverColor?: 'gray' | 'red' | 'fill-red'
}

export const RoundButton: FC<RoundButtonProps> = ({
  className,
  type,
  color,
  onHoverColor,
  tabIndex,
  onClick,
  onKeyUp,
}) => {
  const svgClassName = `color-${color} hover-${onHoverColor}`
  return (
    <div
      className={`round-button ${className}`}
      onClick={onClick}
      onKeyUp={(e) => e.key === onKeyUp?.key && onKeyUp.func()}
      tabIndex={tabIndex}
    >
      {type === 'cross' && <CloseRoundedIcon className={svgClassName} />}
      {type === 'trash' && <DeleteOutlineIcon className={svgClassName} />}
      {type === 'edit' && <EditIcon className={svgClassName} />}
    </div>
  )
}

RoundButton.defaultProps = {
  type: 'cross',
  color: 'gray',
  onHoverColor: 'gray',
}

export default RoundButton
