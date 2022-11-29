import CachedIcon from '@material-ui/icons/Cached'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import SearchIcon from '@mui/icons-material/Search'
import UploadIcon from '@mui/icons-material/Upload'
import { FC, ReactNode } from 'react'
import './styles.scss'

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
        onKeyUp={(e) => e.key === onKeyUp?.key && onKeyUp.func()}
        tabIndex={tabIndex}
      >
        {icon && icon}
        {!icon && (
          <>
            {type === 'cross' && <CloseRoundedIcon className={svgClassName} />}
            {type === 'trash' && <DeleteOutlineIcon className={svgClassName} />}
            {type === 'edit' && <EditIcon className={svgClassName} />}
            {type === 'refresh' && <CachedIcon className={svgClassName} />}
            {type === 'search' && <SearchIcon className={svgClassName} />}
            {type === 'upload' && <UploadIcon className={svgClassName} />}
            {type === 'file' && (
              <InsertDriveFileIcon className={svgClassName} />
            )}
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
