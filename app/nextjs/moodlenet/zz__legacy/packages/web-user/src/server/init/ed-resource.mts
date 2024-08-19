import type { Issuer } from '@moodlenet/core-domain/resource'
import { SYSTEM_ISSUER, UNAUTHENTICATED_ISSUER } from '@moodlenet/core-domain/resource'
import { setProviders } from '@moodlenet/ed-resource/server'
import { getCurrentSystemUser } from '@moodlenet/system-entities/server'
import { verifyCurrentTokenCtx } from '../exports.mjs'

setProviders({
  async getIssuer([paramType, val]) {
    const currentSystemUser = await getCurrentSystemUser()

    return currentSystemUser.type === 'root' || currentSystemUser.type === 'pkg'
      ? SYSTEM_ISSUER
      : currentSystemUser.type === 'entity'
        ? await (async (): Promise<Issuer> => {
            const currentWebUser = await verifyCurrentTokenCtx()
            if (!currentWebUser) {
              return UNAUTHENTICATED_ISSUER
            } else if (currentWebUser.payload.isRoot) {
              return SYSTEM_ISSUER
            }

            const creator =
              paramType === 'creator' ? val : currentWebUser.payload.profile._id === val
            return {
              type: 'user',
              feats: {
                admin: currentWebUser.payload.webUser.isAdmin,
                creator,
                publisher: currentWebUser.payload.profile.publisher,
              },
            }
          })()
        : UNAUTHENTICATED_ISSUER
  },
})
