import { FC } from 'react'
import '../../styles/main.scss'
import '../../styles/view.scss'

export type MainPageWrapperProps = {
  onKeyDown?(arg0: unknown): unknown
}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children, onKeyDown }) => {
  return (
    <div className="main-page-wrapper" onKeyDown={onKeyDown}>
      {children}
    </div>
  )
}
MainPageWrapper.displayName = 'MainPageWrapper'
