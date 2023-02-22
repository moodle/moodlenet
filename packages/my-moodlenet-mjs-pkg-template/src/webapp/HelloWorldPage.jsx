import { MainLayoutContainer } from '@moodlenet/react-app/ui'
import { useContext } from 'react'
import { MyContext } from './Context'

const HelloWorldPage = () => {
  const { apiResponse } = useContext(MyContext)
  return (
    <MainLayoutContainer>
      <h1>Hello World</h1>
      <pre>
        apiResponse:
        {JSON.stringify(apiResponse, null, 4)}
      </pre>
    </MainLayoutContainer>
  )
}
HelloWorldPage.displayName = 'HelloWorldPage'

export default HelloWorldPage
