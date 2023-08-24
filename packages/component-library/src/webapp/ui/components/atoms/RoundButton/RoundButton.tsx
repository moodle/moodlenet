import {
  Cached as CachedIcon,
  CloseRounded as CloseRoundedIcon,
  DeleteOutline as DeleteOutlineIcon,
  Edit as EditIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Search as SearchIcon,
} from '@material-ui/icons'
import { Upload as UploadIcon } from '@mui/icons-material'
import type { FC, ReactNode } from 'react'
import './RoundButton.scss'

export type RoundButtonProps = {
  className?: string
  tabIndex?: number
  type?: 'cross' | 'trash' | 'edit' | 'refresh' | 'search' | 'file' | 'upload'
  color?: 'gray' | 'red'
  onHoverColor?: 'gray' | 'red' | 'fill-red'
  abbrTitle?: string
  icon?: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const RoundButton: FC<RoundButtonProps> = ({
  className,
  type,
  color,
  onHoverColor,
  tabIndex,
  abbrTitle,
  icon,
  ...props
}) => {
  const svgClassName = `color-${color} hover-${onHoverColor}`
  return (
    <abbr className={`round-button ${className}`} title={abbrTitle}>
      <div className={`content`} tabIndex={tabIndex} {...props}>
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
