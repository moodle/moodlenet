import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { WebappConfigsRpc } from '../common/expose-def.mjs'
import type { MainContextResource } from '../common/types.mjs'
import type { ValidationSchemas } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { MainContext } from './MainContext.js'
import { ProvideResourceContext } from './ResourceContext.js'
import { shell } from './shell.mjs'

const MainWrapper: MainAppPluginWrapper = ({ children }) => {
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
    shell.rpc.me('webapp/get-configs')().then(setConfigs)
  }, [])

  const validationSchemas = useMemo<ValidationSchemas>(
    () => getValidationSchemas(configs.validations),
    [configs.validations],
  )

  const mainValue = useMemo<MainContextResource>(
    () => ({
      configs,
      validationSchemas,
    }),
    [configs, validationSchemas],
  )

  return (
    <MainContext.Provider value={mainValue}>
      <ProvideResourceContext>{children}</ProvideResourceContext>
    </MainContext.Provider>
  )
}

export default MainWrapper
