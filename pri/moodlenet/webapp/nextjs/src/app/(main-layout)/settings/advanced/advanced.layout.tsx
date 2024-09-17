import { layoutPropsWithChildren } from '../../../../lib/server/utils/slots'
import './advanced.style.scss'

export default async function AdvancedLayout(props: layoutPropsWithChildren) {
  return props.children
}
