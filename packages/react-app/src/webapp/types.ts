import { ReactAppExt } from '..'
import { WebappPluginMainModule } from '../types'
import { MoodlenetLib } from './main-lib'

export type ReactAppLib = MoodlenetLib
export type ReactAppPluginMainModule = WebappPluginMainModule<ReactAppExt, ReactAppLib>
