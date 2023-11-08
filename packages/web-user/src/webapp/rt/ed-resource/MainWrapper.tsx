import type {
  MainContextResource,
  ResourceFormProps,
  RpcCaller,
  ValidationSchemas,
} from '@moodlenet/ed-resource/common'
import { getValidationSchemas } from '@moodlenet/ed-resource/common'
import { MainContext, ProvideResourceContext } from '@moodlenet/ed-resource/webapp'
import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { WebappConfigsRpc } from '../../../common/expose-def-ed-resource.mjs'
import { shell } from '../shell.mjs'

const ResourceMainWrapper: MainAppPluginWrapper = ({ children }) => {
  const rpcCaller = useMemo((): RpcCaller => {
    const rpc = shell.rpc.edResource
    // const addAuth = addAuthMissing(auth.access || null)
    const rpcItem: RpcCaller = {
      create: (content: File | string) =>
        rpc('ed-resource/webapp/create' /* , { rpcId } */)({ content: [content] }),
      get: (key: string) =>
        rpc('ed-resource/webapp/get/:_key', { rpcId: `get-resource#${key}` })(null, { _key: key }),
      edit: (key: string, values: ResourceFormProps) =>
        rpc('ed-resource/webapp/edit/:_key')({ values }, { _key: key }),
      // get: (key: string) => addAuth(rpc('ed-resource/webapp/get/:_key')(null, { _key: key })),
      trash: (key: string) => rpc('ed-resource/webapp/trash/:_key')(null, { _key: key }),
      // setImage: (key: string, file: File | undefined | null, rpcId) =>
      //   rpc('ed-resource/webapp/upload-image/:_key', { rpcId })({ file: [file] }, { _key: key }),
      setIsPublished: (key, publish) =>
        rpc('ed-resource/webapp/set-is-published/:_key')({ publish }, { _key: key }),
    }

    return rpcItem
  }, [])

  const [configs, setConfigs] = useState<WebappConfigsRpc>({
    validations: {
      contentMaxUploadSize: 0,
      imageMaxUploadSize: 0,
      descriptionLength: { max: 0, min: 0 },
      titleLength: { max: 0, min: 0 },
      learningOutcomes: {
        amount: { min: 0, max: 0 },
        sentenceLength: { min: 0, max: 0 },
      },
    },
  })

  useEffect(() => {
    shell.rpc.edResource('ed-resource/webapp/get-configs')().then(setConfigs)
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

export default ResourceMainWrapper
