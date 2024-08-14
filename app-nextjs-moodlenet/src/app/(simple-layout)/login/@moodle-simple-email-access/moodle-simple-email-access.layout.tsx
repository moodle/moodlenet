import { layoutPropsWithChildren } from '@/lib/server/utils/slots'
import './moodle-simple-email-access.style.scss'

export default async function MoodleSimpleEmailAccessLayout(props: layoutPropsWithChildren) {
  return props.children
}
