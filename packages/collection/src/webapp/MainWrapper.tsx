import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type {
  CollectionFormProps,
  CollectionFormRpc,
  MainContextCollection,
  RpcCaller,
} from '../common/types.mjs'
import { CollectionContextProvider } from './CollectionContext.js'
import { MainContext } from './MainContext.js'
import { shell } from './shell.mjs'

const toFormRpc = (r: CollectionFormProps): CollectionFormRpc => r

const MainWrapper: MainAppPluginWrapper = ({ children }) => {
  const mainValue: MainContextCollection = useMemo(() => {
    const rpc = shell.rpc.me

    const rpcCaller: RpcCaller = {
      collectionsResorce: (containingResourceKey: string) =>
        rpc['webapp/my-collections/:containingResourceKey'](null, { containingResourceKey }),

      actionResorce: (collectionKey: string, action: 'remove' | 'add', resourceKey: string) =>
        rpc['webapp/in-collection/:collectionKey/:action-resource/:resourceKey'](null, {
          collectionKey,
          action,
          resourceKey,
        }),

      edit: (key: string, values: CollectionFormProps) =>
        rpc['webapp/edit/:_key']({ values: toFormRpc(values) }, { _key: key }),

      get: (_key: string) => rpc['webapp/get/:_key'](null, { _key }), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      // get: (_key: string) => addAuth(rpc['webapp/get/:_key'](null, { _key })), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string

      _delete: async (key: string) => rpc['webapp/delete/:_key'](null, { _key: key }),

      setIsPublished: async (key: string, publish: boolean) =>
        rpc['webapp/set-is-published/:_key']({ publish }, { _key: key }),

      setImage: async (key: string, file: File | null | undefined) =>
        rpc['webapp/upload-image/:_key']({ file: [file] }, { _key: key }),

      create: () => rpc['webapp/create'](),
    }

    const ctx: MainContextCollection = {
      rpcCaller,
    }
    return ctx
  }, [])

  return (
    <MainContext.Provider value={mainValue}>
      <CollectionContextProvider>{children}</CollectionContextProvider>
    </MainContext.Provider>
  )
}

export default MainWrapper
