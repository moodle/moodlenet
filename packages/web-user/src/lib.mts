import { glyphDescriptors } from './init.mjs'
import { CreateRequest } from './types.mjs'
import { graphPkg } from './use-pkg-apis.mjs'

export async function createProfile({ displayName, userId }: CreateRequest) {
  graphPkg.api('node/create')(
    glyphDescriptors.Profile,
    {
      description: '',
      title: displayName,
    },
    { authenticableBy: { userId } },
  )
}
