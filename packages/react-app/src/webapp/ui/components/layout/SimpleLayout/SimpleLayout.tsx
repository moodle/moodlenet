import { CSSProperties, FC, ReactNode } from 'react'
import { MainFooter, MainFooterProps } from '../../../../exports/ui.mjs'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import {
  MinimalisticHeader,
  MinimalisticHeaderProps,
} from '../../organisms/Header/Minimalistic/MinimalisticHeader.js'
import { LayoutContainer } from '../LayoutContainer/LayoutContainer.js'
import './SimpleLayout.scss'
// import { StateContext } from './Providers'

export type SimpleLayoutProps = {
  headerProps: MinimalisticHeaderProps
  footerProps: MainFooterProps
  style?: CSSProperties
  contentStyle?: CSSProperties
  children?: ReactNode
}

export const SimpleLayout: FC<SimpleLayoutProps> = ({
  headerProps,
  footerProps,
  style,
  contentStyle,
  children,
}) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  // const styleContext = useContext(SettingsCtx)

  return (
    <LayoutContainer>
      <div className="simple-layout" style={style}>
        <MinimalisticHeader {...headerProps} />
        {/* <div className="side-menu">
          {routes.map(({ path, label }, i) => (
            <div key={`${path}_${i}`}>
              <Link to={path}>
                <span className="menu-item-link">{label}</span>
              </Link>
            </div>
          ))}
      </div> */}
        <div style={contentStyle} className="content">
          {children}
          <MainFooter {...footerProps} />
        </div>
      </div>
    </LayoutContainer>
  )
}

SimpleLayout.defaultProps = {}
export default SimpleLayout
