import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type {
  MainContextResource,
  ResourceFormProps,
  ResourceFormRpc,
  RpcCaller,
} from '../common/types.mjs'
import { MainContext } from './MainContext.js'
import { ProvideResourceContext } from './ResourceContext.js'
import { shell } from './shell.mjs'

// const addAuthMissing =
//   (missing: { isAuthenticated: boolean }) =>
//   (rpcResource: Promise<ResourceRpc | undefined>): Promise<ResourceProps | undefined> =>
//     rpcResource.then(res => res && ModelRpcToProps(missing, res))

const toFormRpc = (r: ResourceFormProps): ResourceFormRpc => r
// const toFormProps = (r: ResourceFormRpc): ResourceFormProps => r

// const menuItems = {
//   create: (onClick: () => void): HeaderMenuItem => ({
//     Icon: '(icon)',
//     text: `New Resource`,
//     key: 'newResource1',
//     onClick,
//   }),
// }

const MainWrapper: MainAppPluginWrapper = ({ children }) => {
  const rpcCaller = useMemo((): RpcCaller => {
    const rpc = shell.rpc.me
    // const addAuth = addAuthMissing(auth.access || null)

    const rpcItem: RpcCaller = {
      edit: (key: string, values: ResourceFormProps) =>
        rpc['webapp/edit/:_key']({ values: toFormRpc(values) }, { _key: key }),
      get: (key: string) => rpc['webapp/get/:_key'](null, { _key: key }),
      // get: (key: string) => addAuth(rpc['webapp/get/:_key'](null, { _key: key })),
      _delete: (key: string) => rpc['webapp/delete/:_key'](null, { _key: key }),
      setImage: (key: string, file: File | undefined | null) =>
        rpc['webapp/upload-image/:_key']({ file: [file] }, { _key: key }),
      setContent: (key: string, content: File | string | undefined | null) =>
        rpc['webapp/upload-content/:_key']({ content: [content] }, { _key: key }),
      setIsPublished: (key, publish) =>
        rpc['webapp/set-is-published/:_key']({ publish }, { _key: key }),
      create: () => rpc['webapp/create'](),
    }

    return rpcItem
  }, [])

  const mainValue: MainContextResource = {
    rpcCaller,
  }

  return (
    <MainContext.Provider value={mainValue}>
      <ProvideResourceContext>{children}</ProvideResourceContext>
    </MainContext.Provider>
  )
}

export default MainWrapper
