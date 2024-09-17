'use client'
// import {
//   CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
//   CloseRounded as CloseRoundedIcon,
//   ErrorOutline as ErrorOutlineIcon,
//   InfoOutlined as InfoOutlinedIcon,
//   ReportProblemOutlined as ReportProblemOutlinedIcon,
// } from '@mui/icons-material'
import type React from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Card from '../../atoms/Card/Card'
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
  onClose,
}) => {
  const [state, setState] = useState<'opening' | 'opened' | 'closing' | 'closed' | 'hidden'>(
    'opening',
  )
  const snackbarRef = useRef<HTMLDivElement>(null)

  const handleonClose = useCallback(() => {
    setState('closing')
    setTimeout(() => {
      onClose && onClose()
      setState('closed')
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (waitDuration) {
      setState('closed')
      const timer = setTimeout(() => {
        setState('opening')
      }, waitDuration)
      return () => clearTimeout(timer)
    }
    return
  }, [waitDuration, setState])

  useEffect(() => {
    if (state === 'opening') {
      const timer = setTimeout(() => {
        setState('opened')
      }, 300)
      return () => clearTimeout(timer)
    }
    return
  }, [setState, state])

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
      ref={snackbarRef}
      className={`snackbar ${className} type-${type} state-${state} position-${position}`}
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

  if (state === 'closed') return null

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
  type: 'info',
  showCloseButton: false,
  autoHideDuration: 4000,
}

export default Snackbar
