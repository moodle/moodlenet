import { CSSProperties, FC, ReactNode } from 'react'
import { MainHeader, MainHeaderProps } from '../../organisms/Header/MainHeader/MainHeader.js'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import './MainLayout.scss'
// import { StateContext } from './Providers'

export type MainLayoutProps = {
  headerProps: MainHeaderProps
  style?: CSSProperties
  // contentStyle?: CSSProperties
  children?: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = ({
  headerProps,
  style,
  /* contentStyle, */ children,
}) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  // const styleContext = useContext(SettingsCtx)

  return (
    <div className="main-layout" style={style}>
      <MainHeader {...headerProps} />
      {/* <div className="side-menu">
          {routes.map(({ path, label }, i) => (
            <div key={`${path}_${i}`}>
              <Link to={path}>
                <span className="menu-item-link">{label}</span>
              </Link>
            </div>
          ))}
      </div> */}
      <div
        style={
          {
            /* ...contentStyle */
          }
        }
        className="content"
      >
        {children}
        <div className="footer"></div>
      </div>
    </div>
  )
}

MainLayout.defaultProps = {}
export default MainLayout
