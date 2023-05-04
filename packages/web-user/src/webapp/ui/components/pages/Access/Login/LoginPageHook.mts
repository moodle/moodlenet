import { useFooterProps, useMinimalisticHeaderProps } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
// import { useFooterProps } from '../../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
// import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import type { LoginProps } from './Login.js'

export const useLoginProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const { registries } = useContext(MainContext)
  const loginProps = useMemo<LoginProps>(() => {
    const loginItems = registries.loginItems.registry.entries.map(el => ({
      ...el.item,
      key: el.pkgId.name,
    }))
    // console.log('xxxx', loginItems)
    return {
      headerProps,
      footerProps,
      loginItems,
    }
  }, [headerProps, footerProps, registries.loginItems])
  return loginProps
}
