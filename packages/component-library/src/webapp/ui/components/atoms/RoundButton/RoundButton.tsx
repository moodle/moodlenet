import {
  Cached as CachedIcon,
  CloseRounded as CloseRoundedIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Search as SearchIcon,
} from '@material-ui/icons'
import { Upload as UploadIcon } from '@mui/icons-material'
import { FC, ReactNode } from 'react'
import './RoundButton.scss'

export type RoundButtonProps = {
  onClick?(arg0: unknown): unknown
  onKeyUp?: { key: string; func: () => void }
  className?: string
  tabIndex?: number
  type?: 'cross' | 'trash' | 'edit' | 'refresh' | 'search' | 'file' | 'upload'
  color?: 'gray' | 'red'
  onHoverColor?: 'gray' | 'red' | 'fill-red'
  abbrTitle?: string
  icon?: ReactNode
}

export const RoundButton: FC<RoundButtonProps> = ({
  className,
  type,
  color,
  onHoverColor,
  tabIndex,
  abbrTitle,
  onKeyUp,
  icon,
  onClick,
}) => {
  const svgClassName = `color-${color} hover-${onHoverColor}`
  return (
    <abbr className={`round-button ${className}`} title={abbrTitle}>
      <div
        className={`content`}
        onClick={onClick}
        onKeyUp={e => e.key === onKeyUp?.key && onKeyUp.func()}
        tabIndex={tabIndex}
      >
        {icon && icon}
        {!icon && (
          <>
            {type === 'cross' && <CloseRoundedIcon className={svgClassName} />}
            {type === 'trash' && <DeleteOutlineIcon className={svgClassName} />}
            {type === 'edit' && <EditIcon className={svgClassName} />}
            {type === 'refresh' && <CachedIcon className={svgClassName} />}
            {type === 'upload' && <UploadIcon className={svgClassName} />}
            {type === 'search' && <SearchIcon className={svgClassName} />}
            {type === 'file' && <InsertDriveFileIcon className={svgClassName} />}
          </>
        )}
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
