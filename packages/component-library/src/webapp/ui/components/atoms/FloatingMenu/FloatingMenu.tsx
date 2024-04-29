import type React from 'react'
import type { FC, KeyboardEvent, ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card.js'
import './FloatingMenu.scss'

export type FloatingMenuContentItem = {
  Element: ReactElement
  wrapperClassName?: string
}

export type FloatingMenuProps = {
  menuContent: FloatingMenuContentItem[]
  hoverElement: React.ReactNode
  abbr?: string
  hover?: boolean
  className?: string
  divRef?: React.RefObject<HTMLDivElement>
}

export const FloatingMenu: FC<FloatingMenuProps> = ({
  menuContent,
  className,
  abbr,
  hover,
  hoverElement,
  divRef,
}) => {
  const [currentVisible, setCurrentVisible] = useState<boolean | undefined>(false)
  const hoverElementRef = useRef<HTMLDivElement>(null)
  const [isOnHover, setIsOnHover] = useState<boolean>(false)
  const switchMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown', 'ArrowUp'].includes(e.key) && expand()
    ;['Enter'].includes(e.key) && setCurrentVisible(!currentVisible)
  }
  const closeMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['Tab', 'Enter'].includes(e.key) && e.shiftKey && close()
  }
  const closeMenuUp = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowUp'].includes(e.key) && close()
    ;['Tab'].includes(e.key) && e.shiftKey && close()
  }
  const closeMenuDown = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown'].includes(e.key) && close()
    ;['Tab'].includes(e.key) && !e.shiftKey && close()
  }
  const oneElementActions = (e: KeyboardEvent<HTMLDivElement>) => {
    closeMenuUp(e)
    closeMenuDown(e)
  }

  const expand = () => {
    !currentVisible && setCurrentVisible(true)
  }

  const close = () => {
    currentVisible && setCurrentVisible(false)
  }

  const updatedMenuContent = Array.isArray(menuContent)
    ? menuContent.map(({ Element, wrapperClassName }, i) => {
        if (menuContent.length === 1) {
          return (
            <div
              className={`${wrapperClassName}`}
              key={Element.key}
              tabIndex={i + 1}
              onKeyDown={oneElementActions}
            >
              {Element}
            </div>
          )
        } else if (i === 0) {
          return (
            <div
              className={`${wrapperClassName}`}
              key={Element.key}
              tabIndex={i + 1}
              onKeyDown={closeMenuUp}
            >
              {Element}
            </div>
          )
        } else if (menuContent.length - 1 === i) {
          return (
            <div className={`last element ${wrapperClassName}`} key={Element.key} tabIndex={i + 1}>
              {Element}
            </div>
          )
        } else {
          return (
            <div className={`${wrapperClassName}`} key={Element.key} tabIndex={i + 1}>
              {Element}
            </div>
          )
        }
      })
    : menuContent

  const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    const currentTarget = e.currentTarget

    requestAnimationFrame(() => !currentTarget.contains(document.activeElement) && close())
  }

  const handleOnMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const currentTarget = e.currentTarget

    requestAnimationFrame(() => {
      if (
        !(
          currentTarget.contains(document.activeElement) && currentTarget !== document.activeElement
        )
      ) {
        currentVisible ? close() : expand()
      }
    })
    e.stopPropagation()
  }

  useEffect(() => {
    const handleResize = () => {
      const floatingMenuTmp = divRef && divRef.current?.querySelector('.menu')
      const floatingMenuContentTmp = divRef && divRef.current?.querySelector('.menu .content')
      const floatingMenu = floatingMenuTmp && (floatingMenuTmp as HTMLElement)
      const floatingMenuContent = floatingMenuContentTmp && (floatingMenuContentTmp as HTMLElement)

      if (floatingMenu && floatingMenuContent) {
        floatingMenuContent.style.maxHeight = `${window.innerHeight - 68}px`

        const rect = floatingMenu.getBoundingClientRect()

        const hoverElementRefLeft = hoverElementRef.current?.getBoundingClientRect().left

        if (rect && rect.left < 0) {
          const xPos = rect.left
          floatingMenu.style.left = `-${hoverElementRefLeft ?? xPos}` + 'px'
        }
        if (rect && rect.right > window.innerWidth) {
          const overflow = rect.right - window.innerWidth
          const newWidth = floatingMenu.offsetWidth - overflow
          floatingMenu.style.width = `${newWidth}px`
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [divRef, menuContent])

  const handleWindowResize = () => {
    const maxWidth = window.innerWidth
    const floatingMenu = divRef?.current
    if (floatingMenu && floatingMenu.offsetWidth > maxWidth) {
      floatingMenu.style.width = `${maxWidth}px`
    }
    const rect = floatingMenu?.getBoundingClientRect()
    if (floatingMenu && rect && rect.left < 0) {
      floatingMenu.style.left = '0'
    }
    if (floatingMenu && rect && rect.right > window.innerWidth) {
      const overflow = rect.right - window.innerWidth
      const newWidth = floatingMenu.offsetWidth - overflow
      floatingMenu.style.width = `${newWidth}px`
    }
  }

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <div
      className={`floating-menu ${className}`}
      onBlur={e => handleBlur(e)}
      onFocus={expand}
      onMouseDown={e => handleOnMouseDown(e)}
      tabIndex={0}
      ref={divRef}
    >
      <abbr
        className="hover-element"
        title={abbr}
        ref={hoverElementRef}
        onKeyUp={switchMenu}
        onKeyDown={closeMenu}
        onMouseEnter={() => hover && expand()}
        onMouseLeave={() => hover && close()}
      >
        {hoverElement}
      </abbr>
      <div
        className={`menu ${currentVisible || (hover && isOnHover) ? 'visible' : ''}`}
        role="navigation"
        style={{
          top:
            hoverElementRef.current?.clientHeight && `${hoverElementRef.current?.clientHeight}px`,
        }}
        onMouseEnter={() => hover && setIsOnHover(true)}
        onMouseLeave={() => hover && setIsOnHover(false)}
        onClick={close}
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
