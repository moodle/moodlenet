import { useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { LoginProps } from './Login.js'

export const useLoginProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const { reg } = useContext(MainContext)
  const loginProps = useMemo<LoginProps>(() => {
    const loginItems = reg.loginItems.registry.entries.map(el => ({
      ...el.item,
      key: el.pkgId.name,
    }))
    // console.log('xxxx', loginItems)
    return {
      headerProps,
      loginItems,
    }
  }, [headerProps, reg.loginItems])
  return loginProps
}
