import { setPortalParentElement } from '@moodlenet/component-library'
import { baseStyle } from '@moodlenet/component-library/common'
import type { CSSProperties, FC, ReactNode } from 'react'
import { useLayoutEffect, useRef } from 'react'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import './LayoutContainer.scss'
// import { StateContext } from './Providers'

export type LayoutContainerProps = {
  style?: CSSProperties
  children?: ReactNode
}

export const LayoutContainer: FC<LayoutContainerProps> = ({ style, children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  // const styleContext = useContext(AdminSettingsCtx)
  const layoutElementRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const layoutElement = layoutElementRef.current
    if (layoutElement) {
      setPortalParentElement(layoutElement)
      return () => {
        setPortalParentElement()
      }
    }
    return
  }, [])
  return (
    <div
      ref={layoutElementRef}
      className={`layout-container`}
      style={{
        ...style,
        ...baseStyle(),
      }}
    >
      {children}
    </div>
  )
}

LayoutContainer.defaultProps = {}
export default LayoutContainer
