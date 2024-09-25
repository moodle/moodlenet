'use client'

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'

import type React from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Card } from '../../atoms/Card/Card'
import { useInBrowser } from '../../lib/nextjs/utils'
import './Snackbar.scss'

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

export function Snackbar({
  className = '',
  showIcon = true,
  position = 'bottom',
  type = 'info',
  showCloseButton = false,
  autoHideDuration = 4000,
  actions,
  icon,
  style,
  closeButtonText,
  waitDuration,
  children,
  onClose,
}: SnackbarProps) {
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
  const inBrowser = useInBrowser()

  const snackbarStack = !inBrowser ? null : document.querySelector('.snackbar-stack')

  if (state === 'closed') return null

  return !inBrowser
    ? null
    : snackbarStack
      ? snackbar
      : createPortal(
          <div className="snackbar-portal">{snackbar}</div>,
          document.querySelector('.layout-container#layout-container') ?? document.body,
        )
}
