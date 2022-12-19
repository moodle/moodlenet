import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type me from '../main.mjs'
import type auth from '@moodlenet/authentication-manager'
export type MyPkgContext = PkgContextT<typeof me, { auth: typeof auth }>
