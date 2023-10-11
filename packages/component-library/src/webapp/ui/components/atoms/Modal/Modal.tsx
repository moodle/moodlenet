import { CloseRounded as CloseRoundedIcon } from '@mui/icons-material'
import type React from 'react'
import type { ReactNode } from 'react'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Card from '../Card/Card.js'
import './Modal.scss'

export type ModalProps = {
  title?: string
  actions?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  closeButton?: boolean
  children?: ReactNode
  onClose?: () => void
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const Modal: React.FC<ModalProps> = ({
  onClose,
  title,
  actions,
  style,
  className,
  closeButton,
  children,
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
    }
    document.addEventListener('keyup', handleEvent)
    return () => document.removeEventListener('keyup', handleEvent)
  }, [onClose])
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
              {title && <div className="title">{title}</div>}
              {closeButton && (
                <div className="close-button" onClick={handleonClose}>
                  <CloseRoundedIcon />
                </div>
              )}
            </div>
          )}
          {children && <div className="content">{children}</div>}
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
