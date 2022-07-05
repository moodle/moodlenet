import { CoreExt } from '@moodlenet/core'
import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import { useAuthValue } from './lib'
const MainLayout = lib.ui.components.layout.MainLayout
const Index: FC = () => {
  const testStr = lib.useTest('iindex').join('---')
  return (
    <MainLayout>
      <h2>
        Authentication Page {testStr} {useAuthValue()}
      </h2>
      <div>Here we display a big slot with the preferred authentication system</div>
      <div>and slots with other authentication systems</div>
      <div>plus a link/btn to authenticate as ROOT</div>
    </MainLayout>
  )
}
export default Index

lib.priHttp
  .sub<CoreExt>(
    'moodlenet-core',
    '0.1.10',
  )('ext/listDeployed')()
  .pipe(
    lib.priHttp.dematMessage(),
    //map(_ => _.msg.data.map(_ => _.ext.id).join('\n')),
  )
  .subscribe(({ msg }) => console.log(msg.data.ext.id))
