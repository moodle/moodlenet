import type { FC } from 'react'
import { createPortal } from 'react-dom'

import './SnackbarStack.scss'

export type SnackbarStackProps = {
  snackbarList: (React.ReactElement | null)[] | null
  className?: string
  position?: 'top' | 'bottom'
}

export const SnackbarStack: FC<SnackbarStackProps> = ({ snackbarList, className, position }) => {
  return createPortal(
    <div className={`snackbar-stack ${className} position-${position}`}>{snackbarList}</div>,
    document.querySelector('.layout-container#layout-container') ?? document.body,
  )
}

export default SnackbarStack

SnackbarStack.defaultProps = {
  position: 'bottom',
  className: '',
}
