import type myconnection from '../main.mjs'
import { PkgContextT } from '@moodlenet/react-app/web-lib'

export type MyPkgContext = PkgContextT<typeof myconnection>
