import type { OrganizationData } from '@moodlenet/organization/common'
import type { AppearanceData } from '@moodlenet/react-app/common'
import { defaultAppearanceData } from '@moodlenet/react-app/common'
import type { AdminSettingsCtxT, TOrganizationCtx } from '@moodlenet/react-app/webapp'
import { AdminSettingsCtx, OrganizationCtx } from '@moodlenet/react-app/webapp'
import type { FC, PropsWithChildren } from 'react'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { shell } from '../shell.mjs'
// import lib from '../../../../main-lib'

const ProvideAdminSettingsContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [appearanceData, setAppareanceData] = useState<AppearanceData>(defaultAppearanceData)

  const saveAppearanceData = useCallback(async (newAppearanceData: AppearanceData) => {
    await shell.rpc.me['webapp/admin/general/set-appearance']({ appearanceData: newAppearanceData })

    setAppareanceData(newAppearanceData)
  }, [])

  const [devMode, toggleDevMode] = useReducer(prev => !prev, false)

  const updateAllPackages = useCallback(async () => {
    await shell.rpc.me['webapp/admin/packages/update-all-pkgs']()
  }, [])
  useEffect(() => {
    shell.rpc.me['webapp/react-app/get-appearance']().then(({ data: appearanceData }) =>
      setAppareanceData(appearanceData),
    )
  }, [])

  const ctx = useMemo<AdminSettingsCtxT>(() => {
    return {
      saveAppearanceData,
      appearanceData,
      devMode,
      toggleDevMode,
      updateAllPackages,
    }
  }, [updateAllPackages, saveAppearanceData, appearanceData, devMode])

  return <AdminSettingsCtx.Provider value={ctx}>{children}</AdminSettingsCtx.Provider>
}
const EmptyOrganizationData = {
  instanceName: '',
  landingTitle: '',
  landingSubtitle: '',
  smallLogo: '',
  logo: '',
}
const ProvideOrganizationContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [organizationData, setDataOrg] = useState<OrganizationData>(EmptyOrganizationData)

  const saveOrganization = useCallback(
    // WE CAN NOT USE IT IS CALLED 1 TIME ONLY
    (data: OrganizationData) => {
      shell.rpc.me['webapp/admin/general/set-org-data']({ orgData: data })
      setDataOrg(data)
    },
    [],
  )

  useEffect(() => {
    shell.rpc.me['webapp/react-app/get-org-data']().then(
      ({ data: orgData }: { data: OrganizationData }) => setDataOrg(orgData),
    )
  }, [])

  const ctx: TOrganizationCtx = {
    saveOrganization,
    organizationData,
  }

  return <OrganizationCtx.Provider value={ctx}>{children}</OrganizationCtx.Provider>

  /*{
    logo: organizationData.logo,
    smallLogo : organizationData.smallLogo,
    url: '/',
  } */
}

export function GeneralSettingsCtxProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <ProvideOrganizationContext>
      <ProvideAdminSettingsContext>{children}</ProvideAdminSettingsContext>
    </ProvideOrganizationContext>
  )
}
