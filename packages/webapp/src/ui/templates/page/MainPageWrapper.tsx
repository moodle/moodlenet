import { FC } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import { useHeader } from '../../context'
export { PageHeader } from '../../components/PageHeader'

export type MainPageWrapperProps = {}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children }) => {
  const Header = useHeader()
  return (
    <Container text fluid style={{ paddingTop: '4em' }}>
      {Header}
      {children}
    </Container>
  )
}
