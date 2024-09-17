'use client'
// import { CloseRounded as CloseRoundedIcon } from '@mui/icons-material'
import type React from 'react'
import type { ReactNode } from 'react'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Card from '../../atoms/Card/Card'
import './Modal.scss'

export type ModalProps = {
  title?: string
  actions?: ReactNode
  style?: React.CSSProperties
  className?: string
  closeButton?: boolean
  children?: ReactNode
  contentRef?: React.RefObject<HTMLDivElement>
  onPressEnter?: () => void
  onClose?: () => void
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const Modal: React.FC<ModalProps> = ({
  title,
  actions,
  style,
  className,
  closeButton,
  children,
  contentRef,
  onClose,
  onPressEnter,
}) => {
  const handleonClose = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onClose && onClose()
    },
    [onClose],
  )

  useEffect(() => {
    const handleEvent = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        onClose && onClose()
      }
      if (key === 'Enter') {
        onPressEnter && onPressEnter()
      }
    }
    document.addEventListener('keyup', handleEvent)
    return () => document.removeEventListener('keyup', handleEvent)
  }, [onClose, onPressEnter])
  return createPortal(
    <div className="modal-portal">
      <div className={`modal-container ${className}`} onMouseDown={handleonClose}>
        <Card
          className={`modal`}
          onMouseDown={stopPropagation}
          style={{ ...style, ...(!children && { gap: '25px' }) }}
        >
          {(title || closeButton) && (
            <div className="modal-header">
              {<div className="title">{title ?? ''}</div>}
              {closeButton && (
                <div className="close-button" onClick={handleonClose}>
                  <CloseRoundedIcon />
                </div>
              )}
            </div>
          )}
          {children && (
            <div className="content" ref={contentRef}>
              {children}
            </div>
          )}
          {actions && <div className="actions">{actions}</div>}
        </Card>
      </div>
    </div>,
    document.querySelector('.layout-container#layout-container') ?? document.body,
  )
}
Modal.defaultProps = {
  className: '',
  closeButton: true,
}

export default Modal
