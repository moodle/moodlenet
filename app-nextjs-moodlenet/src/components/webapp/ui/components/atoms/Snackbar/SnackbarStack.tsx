import type React from 'react'
import type { FC } from 'react'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import './SnackbarStack.scss'

export type SnackbarStackProps = {
  snackbarList: (React.ReactElement | null)[] | null
  className?: string
  position?: 'top' | 'bottom'
}

export const SnackbarStack: FC<SnackbarStackProps> = ({
  snackbarList,
  className = '',
  position = 'bottom',
}) => {
  const validSnackbars = useMemo(() => {
    return snackbarList?.filter(Boolean) ?? []
  }, [snackbarList])

  return createPortal(
    <div className={`snackbar-stack ${className} position-${position}`}>{validSnackbars}</div>,
    document.querySelector('.layout-container#layout-container') ?? document.body,
  )
}

export default SnackbarStack
