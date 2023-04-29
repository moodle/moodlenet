import { CSSProperties, FC, ReactNode } from 'react'
import { MainFooter, MainFooterProps } from '../../organisms/Footer/MainFooter/MainFooter.js'
import {
  MainHeader,
  MainHeaderContext,
  MainHeaderProps,
  useSimpleMainHeaderContextController,
} from '../../organisms/Header/MainHeader/MainHeader.js'
import { LayoutContainer } from '../LayoutContainer/LayoutContainer.js'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import './MainLayout.scss'
// import { StateContext } from './Providers'

export type MainLayoutProps = {
  headerProps: MainHeaderProps
  footerProps: MainFooterProps
  defaultHideSearchbox?: boolean
  style?: CSSProperties
  streched?: boolean
  children?: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = ({
  headerProps,
  footerProps,
  style,
  streched,
  defaultHideSearchbox = false,
  /* contentStyle, */ children,
}) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  // const styleContext = useContext(SettingsCtx)
  const mainHeaderContextValue = useSimpleMainHeaderContextController(defaultHideSearchbox)

  return (
    <MainHeaderContext.Provider value={mainHeaderContextValue}>
      <LayoutContainer>
        <div
          className={`main-layout ${streched ? 'streched' : ''}`}
          style={{
            ...style,
            // TODO //@ETTO Send context to higher levels
            // ...getColorPalette(styleContext.appearanceData.color),
            // ...styleContext.style,
          }}
        >
          <MainHeader {...headerProps} />
          <div
            style={
              {
                /* ...contentStyle */
              }
            }
            className="content"
          >
            {children}
          </div>
          <MainFooter {...footerProps} />
        </div>
      </LayoutContainer>
    </MainHeaderContext.Provider>
  )
}

MainLayout.defaultProps = {}
export default MainLayout
