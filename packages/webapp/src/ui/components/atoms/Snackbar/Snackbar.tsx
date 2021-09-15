import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'
import React, { useCallback } from 'react'
import Card from '../Card/Card'
import './styles.scss'

export type SnackbarProps = {
  actions?: React.ReactNode
  icon?: React.ReactNode
  showIcon?: boolean
  style?: React.CSSProperties
  type?: 'error' | 'warning' | 'info' | 'success'
  className?: string
  onClose: () => void
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const Snackbar: React.FC<SnackbarProps> = ({
  onClose,
  actions,
  icon,
  showIcon,
  style,
  className,
  type,
  children,
}) => {
  const handleonClose = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onClose()
    },
    [onClose],
  )

  return (
    <Card className={`snackbar ${className} type-${type}`} onClick={stopPropagation} style={style}>
      {showIcon && (icon || type) && (
        <div className="icon">
          {icon
            ? { icon }
            : (() => {
                switch (type) {
                  case 'error':
                    return <ErrorOutlineIcon />
                  case 'warning':
                    return <ReportProblemOutlinedIcon />
                  case 'info':
                    return <InfoOutlinedIcon />
                  case 'success':
                    return <CheckCircleOutlineOutlinedIcon />
                  default:
                    return null
                }
              })()}
        </div>
      )}
      <div className="content">{children}</div>
      {actions && <div className="actions">{actions}</div>}
      <div className="close-button" onClick={handleonClose}>
        <CloseRoundedIcon />
      </div>
    </Card>
  )
}
Snackbar.defaultProps = {
  className: '',
  showIcon: true,
}

export default Snackbar
