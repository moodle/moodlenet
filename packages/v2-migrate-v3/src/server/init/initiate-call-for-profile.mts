import { setCurrentUserFetch } from '@moodlenet/system-entities/server'
import { WebUserEntitiesTools } from '@moodlenet/web-user/server'
import { shell } from '../shell.mjs'

export function initiateCallForProfileKey({ _key, exec }: { _key: string; exec(): any }) {
  return shell.initiateCall(async () => {
    await setCurrentUserFetch(async () => {
      return {
        type: 'entity',
        entityIdentifier: WebUserEntitiesTools.getIdentifiersByKey({
          _key,
          type: 'Profile',
        }).entityIdentifier,
        restrictToScopes: false,
      }
    })
    return exec()
  })
}
