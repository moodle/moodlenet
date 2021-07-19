import { FC } from 'react'
import '../../styles/main.css'
import '../../styles/view.scss'

export type MainPageWrapperProps = {}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children }) => {
  return <div className="main-page-wrapper">{children}</div>
}
MainPageWrapper.displayName = 'MainPageWrapper'
