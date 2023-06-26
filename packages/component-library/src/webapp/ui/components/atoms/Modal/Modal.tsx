import { CloseRounded as CloseRoundedIcon } from '@material-ui/icons'
import type { PropsWithChildren, ReactNode } from 'react'
import React, { useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Card from '../Card/Card.js'
import './Modal.scss'

class Portal extends React.Component<PropsWithChildren<unknown>> {
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

// export type PortalProps = {
//   className?: string
//   el?: string
//   children?: ReactNode
// }

// export const Portal: FC<PortalProps> = ({ className = 'modal-portal', el = 'div', children }) => {
//   const [container] = React.useState(() => {
//     // This will be executed only on the initial render
//     // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
//     const _el = document.createElement(el)
//     _el.setAttribute('class', className)
//     // _el.style.display = 'none'
//     document.body.prepend(_el)
//     return _el
//   })

//   React.useEffect(() => {
//     container.classList.add(className)
//     document.body.appendChild(container)
//     return () => {
//       document.body.removeChild(container)
//     }
//   }, [])

//   return ReactDOM.createPortal(children, container)
// }

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
  return (
    <Portal>
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
    </Portal>
  )
}
Modal.defaultProps = {
  className: '',
  closeButton: true,
}

export default Modal
