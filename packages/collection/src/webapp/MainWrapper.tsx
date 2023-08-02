import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { WebappConfigsRpc } from '../common/expose-def.mjs'
import type { CollectionFormProps, MainContextCollection, RpcCaller } from '../common/types.mjs'
import type { ValidationSchemas } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { CollectionContextProvider } from './CollectionContext.js'
import { MainContext } from './MainContext.js'
import { shell } from './shell.mjs'

const MainWrapper: MainAppPluginWrapper = ({ children }) => {
  const [configs, setConfigs] = useState<WebappConfigsRpc>({
    validations: { imageMaxUploadSize: 0 },
  })

  useEffect(() => {
    shell.rpc.me('webapp/get-configs')().then(setConfigs)
  }, [])

  const rpc = shell.rpc.me

  const rpcCaller: RpcCaller = {
    collectionsResorce: (containingResourceKey: string) =>
      rpc('webapp/my-collections/:containingResourceKey')(null, { containingResourceKey }),

    actionResorce: (collectionKey: string, action: 'remove' | 'add', resourceKey: string) =>
      rpc('webapp/in-collection/:collectionKey/:action(add|remove)/:resourceKey')(null, {
        collectionKey,
        action,
        resourceKey,
      }),

    edit: (key: string, values: CollectionFormProps) =>
      rpc('webapp/edit/:_key')({ values }, { _key: key }),

    get: (_key: string) => rpc('webapp/get/:_key')(null, { _key }), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
    // get: (_key: string) => addAuth(rpc('webapp/get/:_key')(null, { _key })), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string

    _delete: (key: string) => rpc('webapp/delete/:_key')(null, { _key: key }),

    setIsPublished: (key: string, publish: boolean) =>
      rpc('webapp/set-is-published/:_key')({ publish }, { _key: key }),

    setImage: (key: string, file: File | null | undefined) =>
      rpc('webapp/upload-image/:_key')({ file: [file] }, { _key: key }),
    create: () => rpc('webapp/create')(),
  }

  const validationSchemas = useMemo<ValidationSchemas>(
    () => getValidationSchemas(configs.validations),
    [configs.validations],
  )

  const mainValue: MainContextCollection = {
    rpcCaller,
    configs,
    validationSchemas,
  }

  return (
    <MainContext.Provider value={mainValue}>
      <CollectionContextProvider>{children}</CollectionContextProvider>
    </MainContext.Provider>
  )
}

export default MainWrapper
