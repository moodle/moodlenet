import { layoutPropsWithChildren } from '../../../../lib/server/utils/slots'
import './users.style.scss'

export default async function UsersLayout(props: layoutPropsWithChildren) {
  return props.children
}
