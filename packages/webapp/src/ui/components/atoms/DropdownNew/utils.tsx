import React from 'react'

export const setListPosition = ({
  displayMode,
  dropdownButton,
  dropdownContent,
  label,
  window,
}: {
  dropdownContent: React.RefObject<HTMLDivElement | null>
  dropdownButton: React.RefObject<HTMLInputElement | null>
  label: string | undefined
  displayMode: boolean | undefined
  window: Window
}): void => {
  const viewportOffset =
    dropdownButton.current && dropdownButton.current.getBoundingClientRect()
  const top = viewportOffset?.top
  const bottom = viewportOffset && window.innerHeight - viewportOffset.bottom

  if (bottom && top && (bottom > 160 || bottom > top)) {
    dropdownContent.current &&
      (dropdownContent.current.style.maxHeight =
        bottom && bottom - 20 < 160 ? bottom - 20 + 'px' : '160px')
    dropdownContent.current &&
      (dropdownContent.current.style.top =
        label && !displayMode ? '75px' : '50px')
    dropdownContent.current && (dropdownContent.current.style.bottom = 'auto')
    // dropdownContent.current &&
    //   (dropdownContent.current.style.transform = ' translate(-50%, 0px)')
  } else {
    dropdownContent.current &&
      (dropdownContent.current.style.maxHeight =
        top && top < 160 ? top - 20 + 'px' : '160px')
    dropdownContent.current && (dropdownContent.current.style.bottom = '50px')
    dropdownContent.current && (dropdownContent.current.style.top = 'auto')
    // dropdownContent.current &&
    //   (dropdownContent.current.style.transform = ' translate(-50%, 0px)')
  }
}
