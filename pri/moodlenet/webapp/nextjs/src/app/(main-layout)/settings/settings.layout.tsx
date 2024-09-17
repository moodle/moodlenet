import { layoutPropsWithChildren } from '@/lib/server/utils/slots'
import './settings.style.scss'

export default async function SettingsLayout(props: layoutPropsWithChildren) {
  return props.children
}
