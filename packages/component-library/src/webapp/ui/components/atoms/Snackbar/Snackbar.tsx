import {
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  CloseRounded as CloseRoundedIcon,
  ErrorOutline as ErrorOutlineIcon,
  InfoOutlined as InfoOutlinedIcon,
  ReportProblemOutlined as ReportProblemOutlinedIcon,
} from '@mui/icons-material'
import type React from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import Card from '../Card/Card.js'
import './Snackbar.scss'

import { createPortal } from 'react-dom'

export type SnackbarProps = {
  actions?: ReactNode
  icon?: ReactNode
  showIcon?: boolean
  closeButtonText?: string
  style?: CSSProperties
  type?: 'error' | 'warning' | 'info' | 'success'
  className?: string
  autoHideDuration?: number
  waitDuration?: number
  position?: 'top' | 'bottom'
  showCloseButton?: boolean
  children?: ReactNode
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
  closeButtonText,
  className,
  type,
  autoHideDuration,
  waitDuration,
  position,
  children,
}) => {
  const [movementState, setMovementState] = useState<'opening' | 'closing' | 'closed'>('opening')
  const handleonClose = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation()
      setMovementState('closing')
      setTimeout(() => {
        setMovementState('closed')
        onClose && onClose()
      }, 100)
    },
    [onClose],
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
        waitDuration ? autoHideDuration + waitDuration : autoHideDuration,
      )
      return () => clearTimeout(timer)
    }
    return
  }, [autoHideDuration, waitDuration, handleonClose])

  const snackbar = (
    <Card
      className={`snackbar ${className} type-${type} state-${movementState} position-${position}`}
      onClick={stopPropagation}
      style={style}
    >
      {showIcon && (icon || type) && (
        <div className="icon">
          {icon
            ? icon
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
      {(showCloseButton || closeButtonText) && (
        <abbr className="close-button" onClick={handleonClose} title={closeButtonText ?? 'Close'}>
          {closeButtonText ? <span>{closeButtonText}</span> : <CloseRoundedIcon />}
        </abbr>
      )}
    </Card>
  )

  const snackbarStack = document.querySelector('.snackbar-stack')

  return snackbarStack
    ? snackbar
    : createPortal(
        <div className="snackbar-portal">{snackbar}</div>,
        document.querySelector('.layout-container#layout-container') ?? document.body,
      )
}

Snackbar.defaultProps = {
  className: '',
  showIcon: true,
  position: 'bottom',
  showCloseButton: false,
  autoHideDuration: 6000,
}

export default Snackbar
