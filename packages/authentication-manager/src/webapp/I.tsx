import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
const Index: FC = () => {
  const testStr = lib.useTest('iindex').join('---')
  return (
    <div>
      <h2>Authentication Page {testStr}</h2>
      <div>Here we display a big slot with the preferred authentication system</div>
      <div>and slots with other authentication systems</div>
      <div>plus a link/btn to authenticate as ROOT</div>
    </div>
  )
}
export default Index
lib
  .getExposed('moodlenet-pri-http')
  .sub(
    'moodlenet-core',
    '0.1.10',
  )('ext/listDeployed')()
  .subscribe((callFromAuth: any) => console.log({ callFromAuth }))
