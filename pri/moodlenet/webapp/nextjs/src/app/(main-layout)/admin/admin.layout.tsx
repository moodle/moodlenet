import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import './admin.style.scss'

export default async function AdminLayout(props: layoutPropsWithChildren) {
  return props.children
}
