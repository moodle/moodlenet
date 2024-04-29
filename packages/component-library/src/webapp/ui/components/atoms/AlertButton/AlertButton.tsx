import { useEffect, useRef, type FC, type ReactNode } from 'react'
import { ReactComponent as AlertIcon } from '../../../assets/icons/notification-bell.svg'

import { FloatingMenu, type FloatingMenuContentItem } from '../FloatingMenu/FloatingMenu.js'
import './AlertButton.scss'

export type AlertButtonElement = {
  icon: ReactNode
  content: ReactNode
  // deleteNotification: () => void
}

export const getAlertButtonElement = (element: AlertButtonElement): FloatingMenuContentItem => {
  const finalElement = (
    <>
      <div className="alert-icon-container">{element.icon}</div>
      <div className="alert-content">{element.content}</div>
      {/* <div className="alert-close-icon">
        <Close onClick={element.deleteNotification} />
      </div> */}
    </>
  )
  return {
    Element: finalElement,
    wrapperClassName: 'alert-element',
  }
}

export type AlertButtonProps = {
  // profileHref: Href
  // numResourcesToReview: number
  elements?: FloatingMenuContentItem[]
} & React.HTMLAttributes<HTMLDivElement>

export const AlertButton: FC<AlertButtonProps> = ({
  // profileHref,
  // numResourcesToReview,
  elements,
  // ...props
}) => {
  const hoverElement = (
    <div className="alert-button">
      <div className="red-dot" />
      <div className="alert-icon-container">
        <AlertIcon />
      </div>
    </div>
  )
  const floatingMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const menuContentList = floatingMenuRef.current?.querySelectorAll('.alert-element')
    if (menuContentList) {
      let maxWidth = 0
      menuContentList.forEach(element => {
        const width = element.querySelector('.alert-icon-container')?.clientWidth || 0
        maxWidth = Math.max(maxWidth, width)
      })
      menuContentList.forEach(element => {
        const firstChild = (element as HTMLElement)?.firstChild
        if (firstChild) {
          ;(firstChild as HTMLElement).style.width = `${maxWidth}px`
        }
      })
    }
  }, [elements])

  const handleResize = () => {
    const floatingMenu = floatingMenuRef.current?.querySelector('.menu .content')
    const windowHeight = window.innerHeight
    console.log('floatingMenu', floatingMenu)

    if (floatingMenu) {
      ;(floatingMenu as HTMLElement).style.maxHeight = `${windowHeight - 68}px`
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [elements])

  return (
    elements &&
    elements?.length > 0 && (
      <FloatingMenu
        className="alert-button-floating-menu"
        hoverElement={hoverElement}
        menuContent={elements}
        divRef={floatingMenuRef}
      ></FloatingMenu>
    )
  )
}

AlertButton.defaultProps = {}

export default AlertButton
