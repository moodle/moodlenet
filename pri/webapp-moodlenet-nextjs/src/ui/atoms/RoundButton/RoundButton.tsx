'use client'
import CachedIcon from '@mui/icons-material/Cached'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import SearchIcon from '@mui/icons-material/Search'
import UploadIcon from '@mui/icons-material/Upload'

import type { ReactNode } from 'react'
import './RoundButton.scss'

export type RoundButtonProps = {
  className?: string
  tabIndex?: number
  type?: 'cross' | 'trash' | 'edit' | 'refresh' | 'search' | 'file' | 'upload'
  color?: 'gray' | 'red'
  onHoverColor?: 'gray' | 'red' | 'fill-red'
  abbrTitle?: string
  disabled?: boolean
  icon?: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function RoundButton({
  type = 'cross',
  color = 'gray',
  onHoverColor = 'gray',
  className,
  tabIndex,
  disabled,
  abbrTitle,
  icon,
  ...props
}: RoundButtonProps) {
  const svgClassName = `color-${color} hover-${onHoverColor}`
  return (
    <abbr
      className={`round-button ${className} ${disabled ? 'disabled' : ''}
    `}
      title={abbrTitle}
    >
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
