import { useMemo } from 'react'
import { loginItems as loginItemsRegistry } from '../../../../../registries.mjs'
import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { LoginProps } from './Login.js'

export const useLoginProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const { registry } = loginItemsRegistry.useRegistry()
  const loginProps = useMemo<LoginProps>(() => {
    const loginItems = registry.entries.map(el => ({ ...el.item, key: el.pkgId.name }))
    // console.log('xxxx', loginItems)
    return {
      headerProps,
      loginItems,
    }
  }, [headerProps, registry.entries])
  return loginProps
}
