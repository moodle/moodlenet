import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { WebappConfigsRpc } from '../common/expose-def.mjs'
import type { MainContextResource, ResourceFormProps, RpcCaller } from '../common/types.mjs'
import type { ValidationSchemas } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { MainContext } from './MainContext.js'
import { ProvideResourceContext } from './ResourceContext.js'
import { shell } from './shell.mjs'

const MainWrapper: MainAppPluginWrapper = ({ children }) => {
  const rpcCaller = useMemo((): RpcCaller => {
    const rpc = shell.rpc.me
    // const addAuth = addAuthMissing(auth.access || null)

    const rpcItem: RpcCaller = {
      edit: (key: string, values: ResourceFormProps) =>
        rpc('webapp/edit/:_key')({ values }, { _key: key }),
      get: (key: string) => rpc('webapp/get/:_key')(null, { _key: key }),
      // get: (key: string) => addAuth(rpc('webapp/get/:_key')(null, { _key: key })),
      _delete: (key: string) => rpc('webapp/delete/:_key')(null, { _key: key }),
      setImage: (key: string, file: File | undefined | null) =>
        rpc('webapp/upload-image/:_key')({ file: [file] }, { _key: key }),
      setContent: (key: string, content: File | string | undefined | null) =>
        rpc('webapp/upload-content/:_key')({ content: [content] }, { _key: key }),
      setIsPublished: (key, publish) =>
        rpc('webapp/set-is-published/:_key')({ publish }, { _key: key }),
      create: () => rpc('webapp/create')(),
    }

    return rpcItem
  }, [])

  const [configs, setConfigs] = useState<WebappConfigsRpc>({
    validations: { contentMaxUploadSize: 0, imageMaxUploadSize: 0 },
  })

  useEffect(() => {
    shell.rpc.me('webapp/get-configs')().then(setConfigs)
  }, [])

  const validationSchemas = useMemo<ValidationSchemas>(
    () => getValidationSchemas(configs.validations),
    [configs.validations],
  )

  const mainValue = useMemo<MainContextResource>(
    () => ({
      rpcCaller,
      configs,
      validationSchemas,
    }),
    [configs, rpcCaller, validationSchemas],
  )

  return (
    <MainContext.Provider value={mainValue}>
      <ProvideResourceContext>{children}</ProvideResourceContext>
    </MainContext.Provider>
  )
}

export default MainWrapper
