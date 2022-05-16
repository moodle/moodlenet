import type { ExtDef, Shell } from '@moodlenet/kernel'
import { MoodlenetSysLogExt, MoodlenetSysLogLib } from './types'

export const moodlenetSysLogLib = <Def extends ExtDef>(shell: Shell<Def>): MoodlenetSysLogLib => {
  const logPort = shell.push('in')<MoodlenetSysLogExt>('moodlenet.sys-log@0.1.10')

  return {
    debug: logPort('debug'),
    error: logPort('error'),
    fatal: logPort('fatal'),
    info: logPort('info'),
    log: logPort('log'),
    warn: logPort('warn'),
  }
}
