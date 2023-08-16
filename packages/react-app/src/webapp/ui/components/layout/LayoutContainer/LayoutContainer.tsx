import { baseStyle } from '@moodlenet/component-library/common'
import type { CSSProperties, FC, ReactNode } from 'react'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import './LayoutContainer.scss'
// import { StateContext } from './Providers'

export type LayoutContainerProps = {
  style?: CSSProperties
  children?: ReactNode
}

export const LayoutContainer: FC<LayoutContainerProps> = ({ style, children }) => {
  return (
    <div
      className={`layout-container`}
      id={`layout-container`}
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
