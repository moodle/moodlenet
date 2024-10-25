import { layoutPropsWithChildren } from '../../../../lib/server/utils/slots'
import './general.style.scss'

export default async function GeneralLayout(props: layoutPropsWithChildren) {
  return props.children
}
