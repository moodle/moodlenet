import { FC } from 'react'
import '../../styles/main.css'

export type MainPageWrapperProps = {}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children }) => {
  return <div className="main-page-wrapper">{children}</div>
}
