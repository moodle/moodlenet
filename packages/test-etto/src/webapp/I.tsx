import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'

const MainLayout = lib.ui.components.layout.MainLayout
const Index: FC = () => {
  const testStr = lib.useTest('iindex').join('---')
  return (
    <MainLayout>
      <h2>B
        Etto ext Page {testStr}
      </h2>
      <div>Here we display a big slot with the preferred authentication system</div>
      <div>and slots with other authentication systems</div>
      <div>plus a link/btn to authenticate as ROOT</div>
    </MainLayout>
  )
}
export default Index
