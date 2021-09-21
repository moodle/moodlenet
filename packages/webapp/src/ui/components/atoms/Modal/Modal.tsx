import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import React, { useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Card from '../Card/Card'
import './styles.scss'

class Portal extends React.Component {
  static el = (() => {
    const _el = document.createElement('div')
    _el.setAttribute('class', 'modal-portal')
    _el.style.display = 'none'
    document.body.prepend(_el)
    return _el
  })()
  componentDidMount() {
    Portal.el.style.display = 'block'
  }

  componentWillUnmount() {
    Portal.el.style.display = 'none'
  }

  render() {
    return ReactDOM.createPortal(this.props.children, Portal.el)
  }
}

export type ModalProps = {
  title?: string
  actions?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  closeButton?: boolean
  onClose: () => void
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const Modal: React.FC<ModalProps> = ({ onClose, title, actions, style, className, closeButton, children }) => {
  const handleonClose = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onClose()
    },
    [onClose],
  )

  useEffect(() => {
    const handleEvent = ({ keyCode }: KeyboardEvent) => {
      if (keyCode === 27) {
        onClose()
      }
    }
    document.addEventListener('keyup', handleEvent)
    return () => document.removeEventListener('keyup', handleEvent)
  }, [onClose])
  return (
    <Portal>
      <div className={`modal-container ${className}`} onClick={handleonClose}>
        <Card className={`modal`} onClick={stopPropagation} style={style}>
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
    </Portal>
  )
}
Modal.defaultProps = {
  className: '',
  closeButton: true,
}

export default Modal
