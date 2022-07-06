import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'

export type AuthenticationManagerExt = ExtDef<'moodlenet-authentication-manager', '0.1.10', {}>

const ext: Ext<AuthenticationManagerExt, [CoreExt]> = {
  id: 'moodlenet-authentication-manager@0.1.10',
  displayName: 'auth mng ext',
  requires: ['moodlenet-core@0.1.10'],
  enable(shell) {
    shell.expose({})
    return {
      deploy() {
        shell.lib.pubAll<AuthenticationManagerExt>('moodlenet-authentication-manager@0.1.10', shell, {})
        return {}
      },
    }
  },
}

export default { exts: [ext] }
