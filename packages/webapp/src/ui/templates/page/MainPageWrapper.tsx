import { FC } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
export { PageHeader } from '../../components/PageHeader'

export type MainPageWrapperProps = {}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children }) => {
  return (
    <Container text fluid>
      {children}
    </Container>
  )
}
