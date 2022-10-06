import { ReactAppMainComponentProps } from '@moodlenet/react-app/web-lib.mjs'
import type myConn from '../main.mjs'
export type WebPkgDeps = [typeof myConn]
// eslint-disable-next-line @typescript-eslint/ban-types
export type MainContextT = ReactAppMainComponentProps<WebPkgDeps> & {}
