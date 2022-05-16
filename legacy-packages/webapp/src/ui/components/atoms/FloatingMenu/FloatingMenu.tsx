import React, { FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import './styles.scss'

export type FloatingMenuProps = {
  menuContent: React.ReactElement[]
  hoverElement: React.ReactNode
  hover?: boolean
  className?: string
}

export const FloatingMenu: FC<FloatingMenuProps> = ({
  menuContent,
  className,
  hover,
  hoverElement,
}) => {
  const [currentVisible, setCurrentVisible] = useState<Boolean | undefined>(
    false
  )
  const hoverElementRef = useRef<HTMLDivElement>(null)
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
    <div
      className={`floating-menu ${className}`}
      onClick={() => setCurrentVisible(!currentVisible)}
    >
      <div
        className="hover-element"
        ref={hoverElementRef}
        onKeyUp={switchMenu}
        onKeyDown={closeMenu}
        onMouseEnter={() => hover && setCurrentVisible(true)}
        onMouseLeave={() => hover && setCurrentVisible(false)}
      >
        {hoverElement}
      </div>
      <div
        className={`menu ${
          currentVisible || (hover && isOnHover) ? 'visible' : ''
        }`}
        style={{
          top:
            hoverElementRef.current?.clientHeight &&
            `${hoverElementRef.current?.clientHeight}px`,
        }}
        onMouseEnter={() => hover && setIsOnHover(true)}
        onMouseLeave={() => hover && setIsOnHover(false)}
      >
        <Card className="content">{updatedMenuContent}</Card>
      </div>
    </div>
  )
}

FloatingMenu.defaultProps = {
  hover: false,
}
export default FloatingMenu
