import { FC, PropsWithChildren } from 'react'
import './MainLayout.scss'

const MainLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)
  // console.log({ routes })
  return (
    <div className="main-layout">
      <div className="header">
        <div className="content">
          <div className="left">
            <div className="title">
              <span>_</span>MoodleNet
            </div>
          </div>
        </div>
      </div>
      {/* <div className="side-menu">
          {routes.map(({ path, label }, i) => (
            <div key={`${path}_${i}`}>
              <Link to={path}>
                <span className="menu-item-link">{label}</span>
              </Link>
            </div>
          ))}
      </div> */}
      <div className="content">
        {children}
        <div className="footer"></div>
      </div>
    </div>
  )
}

export default MainLayout
