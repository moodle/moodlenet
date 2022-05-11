import React, { FC, KeyboardEvent, useEffect, useState } from 'react'
import Card from '../Card/Card'
import './styles.scss'

export type FloatingMenuProps = {
  menuContent: React.ReactElement[]
  hoverElement: React.ReactNode
  className?: string
  visible?: boolean
}

export const FloatingMenu: FC<FloatingMenuProps> = ({
  visible,
  menuContent,
  className,
  hoverElement,
}) => {
  const [currentVisible, setCurrentVisible] = useState<Boolean | undefined>(
    visible
  )
  const [isOnHover, setIsOnHover] = useState<Boolean>(false)
  const switchMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown', 'ArrowUp'].includes(e.key) && setCurrentVisible(true)
    ;['Enter'].includes(e.key) && setCurrentVisible(!currentVisible)
  }
  const closeMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['Tab'].includes(e.key) && e.shiftKey && setCurrentVisible(false)
  }
  const closeMenuUp = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowUp'].includes(e.key) && setCurrentVisible(false)
    ;['Tab'].includes(e.key) && e.shiftKey && setCurrentVisible(false)
  }
  const closeMenuDown = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown'].includes(e.key) && setCurrentVisible(false)
    ;['Tab'].includes(e.key) && !e.shiftKey && setCurrentVisible(false)
  }
  const oneElementActions = (e: KeyboardEvent<HTMLDivElement>) => {
    closeMenuUp(e)
    closeMenuDown(e)
  }

  const updatedMenuContent = menuContent.map((element, i) => {
    if (menuContent.length === 1) {
      return (
        <div key={i} tabIndex={i + 1} onKeyDown={oneElementActions}>
          {element}
        </div>
      )
    } else if (i === 0) {
      return (
        <div key={i} tabIndex={i + 1} onKeyDown={closeMenuUp}>
          {element}
        </div>
      )
    } else if (menuContent.length - 1 === i) {
      return (
        <div key={i} tabIndex={i + 1} onKeyDown={closeMenuDown}>
          {element}
        </div>
      )
    } else {
      return (
        <div key={i} tabIndex={i + 1}>
          {element}
        </div>
      )
    }
  })

  useEffect(() => {
    const clickOutListener = () => {
      currentVisible && setCurrentVisible(false)
    }
    window.addEventListener('click', clickOutListener)
    return () => window.removeEventListener('click', clickOutListener)
  }, [currentVisible])

  return (
    <div className={`floating-menu ${className}`}>
      <div
        className="hover-element"
        onKeyUp={switchMenu}
        onKeyDown={closeMenu}
        onMouseEnter={() => setCurrentVisible(true)}
        onMouseLeave={() => setCurrentVisible(false)}
      >
        {hoverElement}
      </div>
      <div
        className={`menu ${currentVisible || isOnHover ? 'visible' : ''}`}
        onMouseEnter={() => setIsOnHover(true)}
        onMouseLeave={() => setIsOnHover(false)}
      >
        <Card className="content">{updatedMenuContent}</Card>
      </div>
    </div>
  )
}

export default FloatingMenu
