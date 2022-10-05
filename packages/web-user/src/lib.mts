import { glyphDescriptors } from './init.mjs'
import { CreateRequest } from './types.mjs'
import { graphPkgApis } from './use-pkg-apis.mjs'

export async function createProfile({ displayName, userId }: CreateRequest) {
  graphPkgApis('node/create')(
    glyphDescriptors.Profile,
    {
      description: '',
      title: displayName,
    },
    { authenticableBy: { userId } },
  )
}
