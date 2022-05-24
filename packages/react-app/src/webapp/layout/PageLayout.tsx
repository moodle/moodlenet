import { Layout, PageHeader } from 'antd'
import { FC, PropsWithChildren } from 'react'
import './PageLayout.less'

const { Content } = Layout

const PageLayout: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  return (
    <>
      <PageHeader title={title} />
      <Content className="page-content">{children}</Content>
    </>
  )
}

export default PageLayout
