import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { WebappConfigsRpc } from '../../../common/expose-def.mjs'
import type { ValidationSchemas } from '../../../common/validationSchema.mjs'
import { getValidationSchemas } from '../../../common/validationSchema.mjs'
import { shell } from '../shell.mjs'

export type ProfileContextT = {
  configs: WebappConfigsRpc
  validationSchemas: ValidationSchemas
}
export const ProfileContext = createContext<ProfileContextT>({
  configs: { validations: { imageMaxUploadSize: 0 } },
  validationSchemas: getValidationSchemas({ imageMaxUploadSize: 0 }),
})
export function useProfileContext() {
  return useContext(ProfileContext)
}

export const ProfileContextProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [configs, setConfigs] = useState<WebappConfigsRpc>({
    validations: { imageMaxUploadSize: 0 },
  })
  useEffect(() => {
    shell.rpc.me('webapp/get-configs')().then(setConfigs)
  }, [])

  const validationSchemas = useMemo<ValidationSchemas>(
    () => getValidationSchemas(configs.validations),
    [configs.validations],
  )
  const profileContext = useMemo<ProfileContextT>(() => {
    const profileContext: ProfileContextT = {
      configs,
      validationSchemas,
    }
    return profileContext
  }, [configs, validationSchemas])

  return <ProfileContext.Provider value={profileContext}>{children}</ProfileContext.Provider>
}
