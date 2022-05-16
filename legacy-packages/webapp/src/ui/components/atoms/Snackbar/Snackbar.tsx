import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'
import React, { useCallback, useEffect, useState } from 'react'
import Card from '../Card/Card'
import './styles.scss'

export type SnackbarProps = {
  actions?: React.ReactNode
  icon?: React.ReactNode
  showIcon?: boolean
  buttonText?: string
  style?: React.CSSProperties
  type?: 'error' | 'warning' | 'info' | 'success'
  className?: string
  autoHideDuration?: number
  waitDuration?: number
  position?: 'top' | 'bottom'
  showCloseButton?: boolean
  onClose?: () => void
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const Snackbar: React.FC<SnackbarProps> = ({
  onClose,
  showCloseButton,
  actions,
  icon,
  showIcon,
  style,
  buttonText,
  className,
  type,
  autoHideDuration,
  waitDuration,
  position,
  children,
}) => {
  const [movementState, setMovementState] = useState<
    'opening' | 'closing' | 'closed'
  >('opening')
  const handleonClose = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation()
      setMovementState('closing')
      setTimeout(() => {
        setMovementState('closed')
        onClose && onClose()
      }, 100)
    },
    [onClose]
  )

  useEffect(() => {
    if (waitDuration) {
      setMovementState('closed')
      const timer = setTimeout(() => {
        setMovementState('opening')
      }, waitDuration)
      return () => clearTimeout(timer)
    }
    return
  }, [waitDuration, setMovementState])

  useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(
        () => {
          handleonClose()
        },
        waitDuration ? autoHideDuration + waitDuration : autoHideDuration
      )
      return () => clearTimeout(timer)
    }
    return
  }, [autoHideDuration, waitDuration, handleonClose])

  return (
    <Card
      className={`snackbar ${className} type-${type} state-${movementState} position-${position}`}
      onClick={stopPropagation}
      style={style}
    >
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
      {showCloseButton && buttonText && (
        <div className="close-button" onClick={handleonClose}>
          {buttonText ? <span>{buttonText}</span> : <CloseRoundedIcon />}
        </div>
      )}
    </Card>
  )
}
Snackbar.defaultProps = {
  className: '',
  showIcon: true,
  position: 'bottom',
  showCloseButton: true,
}

export default Snackbar
