import { ReactAppMainComponentProps } from '@moodlenet/react-app/web-lib'
import type myConn from '../main.mjs'
export type WebPkgDeps = [typeof myConn]

export type MainContextT = ReactAppMainComponentProps<WebPkgDeps> // & {}
