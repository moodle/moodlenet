import { plugin } from '@moodlenet/react-app/server'
import type { MyWebAppDeps } from '../../common/exports.mjs'
import { expose as me } from '../expose.mjs'
import { shell } from '../shell.mjs'

false &&
  shell.call(plugin)<MyWebAppDeps>({
    initModuleLoc: ['dist', 'webapp', 'rt', 'init.js'],
    deps: { me },
  })
