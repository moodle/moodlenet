import CachedIcon from '@material-ui/icons/Cached'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import SearchIcon from '@mui/icons-material/Search'
import { FC } from 'react'
import './styles.scss'

export type RoundButtonProps = {
  onClick?(arg0: unknown): unknown
  onKeyUp?: { key: string; func: () => void }
  className?: string
  tabIndex?: number
  type?: 'cross' | 'trash' | 'edit' | 'refresh' | 'search'
  color?: 'gray' | 'red'
  onHoverColor?: 'gray' | 'red' | 'fill-red'
  abbrTitle?: string
}

export const RoundButton: FC<RoundButtonProps> = ({
  className,
  type,
  color,
  onHoverColor,
  tabIndex,
  abbrTitle,
  onKeyUp,
  onClick,
}) => {
  const svgClassName = `color-${color} hover-${onHoverColor}`
  return (
    <abbr className={`round-button ${className}`} title={abbrTitle}>
      <div
        className={`content`}
        onClick={onClick}
        onKeyUp={(e) => e.key === onKeyUp?.key && onKeyUp.func()}
        tabIndex={tabIndex}
      >
        {type === 'cross' && <CloseRoundedIcon className={svgClassName} />}
        {type === 'trash' && <DeleteOutlineIcon className={svgClassName} />}
        {type === 'edit' && <EditIcon className={svgClassName} />}
        {type === 'refresh' && <CachedIcon className={svgClassName} />}
        {type === 'search' && <SearchIcon className={svgClassName} />}
      </div>
    </abbr>
  )
}

RoundButton.defaultProps = {
  type: 'cross',
  color: 'gray',
  onHoverColor: 'gray',
}

export default RoundButton
