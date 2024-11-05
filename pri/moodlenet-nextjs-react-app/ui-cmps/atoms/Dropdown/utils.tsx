'use client'
import type React from 'react'

export const setListPosition = ({
  dropdownButtonRef,
  dropdownContentRef,
  topPosition,
  bottomPosition,
  window,
  label,
}: {
  dropdownContentRef: React.RefObject<HTMLDivElement | null>
  dropdownButtonRef: React.RefObject<HTMLInputElement | null>
  topPosition?: number
  bottomPosition?: number
  window: Window
  label?: boolean
}): void => {
  const viewportOffset =
    dropdownButtonRef.current && dropdownButtonRef.current.getBoundingClientRect()
  const top = viewportOffset?.top
  const bottom = viewportOffset && window.innerHeight - viewportOffset.bottom

  if (bottom && top && (bottom > 160 || bottom > top)) {
    dropdownContentRef.current && (dropdownContentRef.current.className += ' display-on-the-bottom')

    dropdownContentRef.current &&
      (dropdownContentRef.current.style.maxHeight =
        bottom && bottom - 20 < 160 ? bottom - 20 + 'px' : '160px')
    dropdownContentRef.current &&
      dropdownContentRef.current &&
      (dropdownContentRef.current.style.top = topPosition
        ? `${topPosition}px`
        : label
          ? '75px'
          : '55px')
    dropdownContentRef.current && (dropdownContentRef.current.style.bottom = 'auto')
    // dropdownContentRef.current &&
    //   (dropdownContentRef.current.style.transform = ' translate(-50%, 0px)')
  } else {
    dropdownContentRef.current && (dropdownContentRef.current.className += ' display-on-the-top')
    dropdownContentRef.current &&
      (dropdownContentRef.current.style.maxHeight = top && top < 160 ? top - 20 + 'px' : '160px')
    dropdownContentRef.current &&
      (dropdownContentRef.current.style.bottom = bottomPosition ? `${bottomPosition}px` : '50px')
    dropdownContentRef.current && (dropdownContentRef.current.style.top = 'auto')
    // dropdownContentRef.current &&
    //   (dropdownContentRef.current.style.transform = ' translate(-50%, 0px)')
  }
}

export const getRandomSortedArrayElements = <T,>(baseArray: T[], lengthNewArray?: number): T[] => {
  // console.log('base array ', baseArray)
  const newArray: T[] = []
  const newArrayLength = lengthNewArray ?? baseArray.length ?? 0
  // console.log('length new array ', newArrayLength)
  while (newArray.length < newArrayLength) {
    baseArray.forEach(e => {
      if (newArray.length < newArrayLength) {
        newArray.push(e)
      } else {
        return
      }
    })
  }
  // console.log('new array ', newArray)
  return newArray
}
