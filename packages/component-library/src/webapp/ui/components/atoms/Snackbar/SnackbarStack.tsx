import { useEffect } from 'react'
import { Portal } from '../../../../../common.mjs'
import './SnackbarStack.scss'

export type SnackbarStackProps = {
  snackbarList: (React.ReactElement | null)[] | null
  className?: string
  position?: 'top' | 'bottom'
}

export const SnackbarStack: React.FC<SnackbarStackProps> = ({
  snackbarList,
  className,
  position,
}) => {
  useEffect(() => {
    const snackbars = document.getElementsByClassName('snackbar')
    const snackbarPortals = document.getElementsByClassName('snackbar-portal')
    const snackbarStackPortal = document.querySelector('.snackbar-stack')
    for (const snackbar of snackbars) {
      snackbarStackPortal && snackbarStackPortal.append(snackbar)
    }
    for (const snackbarPortal of snackbarPortals) {
      snackbarPortal.remove()
    }

    // snackbars && snackbars.map((snackbar: HTMLDivElement) => snackbar.remove())
    // if (snackbarList) {
    //   const snackbarListChildren = snackbarList.children
    //   const snackbarListChildrenArray = Array.from(snackbarListChildren)
    //   snackbarListChildrenArray.forEach((child) => {
    //     child.addEventListener('animationend', () => {
    //       child.remove()
    //     })
    //   })
    // }
  })

  return (
    <Portal className="snackbar-stack-portal" parentQuery=".layout-container#layout-container">
      <div className={`snackbar-stack ${className} position-${position}`}>{snackbarList}</div>
    </Portal>
  )
}

export default SnackbarStack

SnackbarStack.defaultProps = {
  position: 'bottom',
  className: '',
}
