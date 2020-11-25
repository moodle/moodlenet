import { inspect } from 'util'
import { env } from './domain.env'

export * from './domain'

export const logger = (baseTag: string) => (tag: string) => (
  objs: any,
  level?: 0 | 1 | 2 | 3 | 4
) => {
  const _level = typeof level === 'number' ? level : 2
  if (_level < env.logLevel) {
    return
  }
  setTimeout(() => {
    const pad = 7
    const fn = (['debug', 'log', 'info', 'warn', 'error'] as const)[_level]
    const fnStr = fn
      .toUpperCase()
      .padStart(fn.length + Math.floor((pad - fn.length) / 2), ' ')
      .padEnd(pad, ' ')
    const objStr = Array.isArray(objs)
      ? objs
      : [objs].map((obj) => inspect(obj, false, null, true)).join('\n')
    console[fn](`
    [${fnStr}] @${new Date()} ${baseTag}.${tag}
    ${objStr}
    --++--
    `)
  }, 0)
}

export const nodeLogger = logger('_MainNode')
