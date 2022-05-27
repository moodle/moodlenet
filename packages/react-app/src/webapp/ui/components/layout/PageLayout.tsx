import { FC, PropsWithChildren } from 'react'
import './PageLayout.less'

const PageLayout: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  return (
    <>
      <div title={title} />
      <div className="page-content">{children}</div>
    </>
  )
}

export default PageLayout
