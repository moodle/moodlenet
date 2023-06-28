import kvStoreFactory from '@moodlenet/key-value-store/server'
import { shell } from '../shell.mjs'

export type KeyValueStoreData = {
  'persistence-version': { v: number }
  'email-templates': Record<'new-user-request' | 'recover-password' | 'password-changed', string>
}

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)
