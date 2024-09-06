import { layoutPropsWithChildren } from '../../../../lib/server/utils/slots'
import './moodle-iam-basic.style.scss'

export default async function MoodleIamBasicLayout(props: layoutPropsWithChildren) {
  return props.children
}
