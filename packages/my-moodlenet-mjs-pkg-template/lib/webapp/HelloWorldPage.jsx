import { SimpleLayoutContainer } from '@moodlenet/react-app/ui'
import { useContext } from 'react'
import { MyContext } from './Context'

const HelloWorldPage = () => {
  const { apiResponse } = useContext(MyContext)
  return (
    <SimpleLayoutContainer>
      <h1>Hello World</h1>
      <pre>
        apiResponse:
        {JSON.stringify(apiResponse, null, 4)}
      </pre>
    </SimpleLayoutContainer>
  )
}
HelloWorldPage.displayName = 'HelloWorldPage'

export default HelloWorldPage
