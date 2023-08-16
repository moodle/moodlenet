import {
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  CloseRounded as CloseRoundedIcon,
  ErrorOutline as ErrorOutlineIcon,
  InfoOutlined as InfoOutlinedIcon,
  ReportProblemOutlined as ReportProblemOutlinedIcon,
} from '@material-ui/icons'
import type { CSSProperties, ReactNode } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import Card from '../Card/Card.js'
import './Snackbar.scss'

import { Portal } from '../../../../../common.mjs'

export type SnackbarProps = {
  actions?: ReactNode
  icon?: ReactNode
  showIcon?: boolean
  buttonText?: string
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
  buttonText,
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

  return (
    <Portal className="snackbar-portal" parentQuery=".layout-container#layout-container">
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
        {showCloseButton && buttonText && (
          <div className="close-button" onClick={handleonClose}>
            {buttonText ? <span>{buttonText}</span> : <CloseRoundedIcon />}
          </div>
        )}
      </Card>
    </Portal>
  )
}
Snackbar.defaultProps = {
  className: '',
  showIcon: true,
  position: 'bottom',
  showCloseButton: true,
  autoHideDuration: 6000,
}

export default Snackbar
