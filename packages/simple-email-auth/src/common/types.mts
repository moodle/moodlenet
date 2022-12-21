import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type me from '../init.mjs'
import type auth from '../../../authentication-manager/dist/init.mjs'
export type MyPkgContext = PkgContextT<typeof me, { auth: typeof auth }>
