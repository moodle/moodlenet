import { Layout, Menu } from 'antd'
import { FC, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { RouterCtx } from '../routes'
import './MainLayout.less'

const { Footer, Sider } = Layout

const MainLayout: FC = ({ children }) => {
  const [collapsed, onCollapse] = useState(false)
  const { routes } = useContext(RouterCtx)
  console.log({ routes })
  return (
    <Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        {collapsed ? <div className="logo">N</div> : <div className="logo">Nikhil Kumaran S</div>}
        <Menu theme="dark" mode="inline">
          {routes.map(({ path, label }, i) => (
            <Menu.Item key={`${path}_${i}`}>
              <Link to={path}>
                <span className="menu-item-link">{label}</span>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        {children}
        <Footer>
          <a target="_blank" rel="noopener noreferrer" href="https::github.com/Nikhil-Kumaran/reactjs-boilerplate">
            GitHub
          </a>
          <span> | </span>
          <a target="_blank" rel="noopener noreferrer" href="https::www.npmjs.com/package/reactjs-boilerplate">
            npm
          </a>
        </Footer>
      </Layout>
    </Layout>
  )
}

export default MainLayout
