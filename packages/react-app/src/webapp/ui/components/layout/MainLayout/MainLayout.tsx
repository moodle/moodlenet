import { baseStyle } from '@moodlenet/component-library'
import { CSSProperties, FC, ReactNode } from 'react'
import { MainFooter, MainFooterProps } from '../../organisms/Footer/MainFooter/MainFooter.js'
import { MainHeader, MainHeaderProps } from '../../organisms/Header/MainHeader/MainHeader.js'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import './MainLayout.scss'
// import { StateContext } from './Providers'

export type MainLayoutProps = {
  headerProps: MainHeaderProps
  footerProps: MainFooterProps
  style?: CSSProperties
  streched?: boolean
  children?: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = ({
  headerProps,
  footerProps,
  style,
  streched,
  /* contentStyle, */ children,
}) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  // const styleContext = useContext(SettingsCtx)

  return (
    <div
      className={`main-layout ${streched ? 'streched' : ''}`}
      style={{
        ...style,
        ...baseStyle(),
        // TODO Send context to higher levels
        // ...getColorPalette(styleContext.appearanceData.color),
        // ...styleContext.style,
      }}
    >
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
        <MainFooter {...footerProps} />
      </div>
    </div>
  )
}

MainLayout.defaultProps = {}
export default MainLayout
