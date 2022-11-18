import { Link } from '@moodlenet/react-app/ui'
import { registries } from '@moodlenet/react-app/web-lib'
import { useState } from 'react'
import { MyContext } from './Context.js'
import Router from './Router.jsx'

const MyPageLink = () => {
  return <Link href={{ url: '/my-moodlenet-mjs-pkg-template' }}>my page</Link>
}
const MainComponent = ({ pkgs, pkgId, children }) => {
  registries.routes.useRegister(pkgId, Router)
  registries.rightComponents.useRegister({ Component: MyPageLink })

  const [myPkg] = pkgs
  const [apiResponse, setApiResponse] = useState()
  myPkg.call('helloWorldApi')('my string param', 100).then(setApiResponse)

  return <MyContext.Provider value={{ apiResponse }}>{children}</MyContext.Provider>
}
MainComponent.displayName = 'MyMainComponent'

export default MainComponent
