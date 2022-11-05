import { loginItems as loginItemsRegistry } from '../../../../../registries.mjs'
import { useMinimalisticHeaderProps } from '../../../layout/Headers/HeaderHooks.mjs'
import { LoginProps } from './Login.js'

export const useLopigPageProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const { registry } = loginItemsRegistry.useRegistry()
  const loginItems = registry.entries.map(el => el.item)
  return { loginItems, headerProps }
}
