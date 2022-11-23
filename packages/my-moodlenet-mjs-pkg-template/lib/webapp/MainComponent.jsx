import { Link } from '@moodlenet/react-app/ui'
import { registries } from '@moodlenet/react-app/web-lib'
import { useEffect, useMemo, useState } from 'react'
import { MyContext } from './Context.js'
import Router from './Router.jsx'

const MyPageLink = () => {
  return <Link href={{ url: '/my-moodlenet-mjs-pkg-template' }}>my page</Link>
}
const myRightComponent = { Component: MyPageLink }
const MainComponent = ({ pkgs, pkgId, children }) => {
  registries.routes.useRegister(pkgId, Router)
  registries.rightComponents.useRegister(pkgId, myRightComponent)

  const [myPkg] = pkgs
  const [apiResponse, setApiResponse] = useState()
  useEffect(() => {
    myPkg.call('helloWorldApi')('my string param', 100).then(setApiResponse)
  }, [myPkg])

  const ctx = useMemo(() => ({ apiResponse }), [apiResponse])
  return <MyContext.Provider value={ctx}>{children}</MyContext.Provider>
}
MainComponent.displayName = 'MyMainComponent'

export default MainComponent
