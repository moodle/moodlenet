import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import { useSearchParams } from 'react-router-dom'
const MainLayout = lib.ui.components.layout.MainLayout

const A: FC = () => {
  const [params] = useSearchParams()
  const xParam = params.get('x')
  const testStr = lib.useTest('aaa').join(':::')
  return (
    <MainLayout>
      <h2>
        login/a useTest0{testStr} ** x={xParam}
      </h2>
    </MainLayout>
  )
}

export default A
