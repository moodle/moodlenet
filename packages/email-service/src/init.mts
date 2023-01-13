import kvStore from './kvStore.mjs'
export * from './types.mjs'

if (!(await kvStore.get('mailerCfg', '')).value) {
  kvStore.set('mailerCfg', '', {
    defaultFrom: 'noreply',
    defaultReplyTo: 'noreply',
  })
}
