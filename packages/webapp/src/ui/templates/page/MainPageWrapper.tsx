import { FC } from 'react'
import 'semantic-ui-css/semantic.min.css'
import '../../styles/main.css'
export { PageHeader } from '../../components/PageHeader'

export type MainPageWrapperProps = {}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children }) => {
  return (
    <div className="main-page-wrapper">
      {children}
    </div>
  )
}
