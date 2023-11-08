import { shell } from './shell.mjs'

import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import { assertRpcFileReadable, readableRpcFile, RpcStatus } from '@moodlenet/core'
import { getCurrentSystemUser } from '@moodlenet/system-entities/server'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import type { ResourceExposeType } from '../common/expose-def.mjs'
import { resourceFiles } from './init/fs.mjs'
import {
  getResourceLogicalFilename,
  getResourcesCountInSubject,
  incrementResourceDownloads,
  RESOURCE_DOWNLOAD_ENDPOINT,
  searchResources,
} from './services.mjs'

export type FullResourceExposeType = PkgExposeDef<ResourceExposeType & ServerResourceExposeType>

export const expose = await shell.expose<FullResourceExposeType>({
  rpc: {
    'webapp/get-resources-count-in-subject/:subjectKey': {
      guard: () => void 0,
      async fn(_, { subjectKey }) {
        const count = await getResourcesCountInSubject({ subjectKey })
        return count ?? { count: 0 }
      },
    },
    [RESOURCE_DOWNLOAD_ENDPOINT]: {
      guard: () => void 0,
      async fn(_, { _key }: { _key: string }) {
        const resourceLogicalFilename = getResourceLogicalFilename(_key)
        const fsItem = await resourceFiles.get(resourceLogicalFilename)
        if (!fsItem) {
          throw RpcStatus('Not Found')
        }
        const readable = await assertRpcFileReadable(fsItem.rpcFile)

        readable.on('end', async () => {
          const currentSysUser = await getCurrentSystemUser()
          shell.events.emit('resource:downloaded', { resourceKey: _key, currentSysUser })
          incrementResourceDownloads({ _key })
        })
        return readableRpcFile({ ...fsItem.rpcFile }, () => readable)
      },
    },
    'webapp/search': {
      guard: () => void 0,
      async fn(
        _,
        __,
        {
          sortType,
          filterSubjects,
          filterLanguages,
          filterLevels,
          filterTypes,
          filterLicenses,
          limit,
          text,
          after,
        },
      ) {
        const { endCursor, list } = await searchResources({
          limit,
          sortType,
          text,
          after,
          filters: [
            ['subject', filterSubjects ? filterSubjects.split('|') : []],
            ['language', filterLanguages ? filterLanguages.split('|') : []],
            ['level', filterLevels ? filterLevels.split('|') : []],
            ['type', filterTypes ? filterTypes.split('|') : []],
            ['license', filterLicenses ? filterLicenses.split('|') : []],
          ],
        })
        return {
          list: list.map(({ entity: { _key } }) => ({ _key })),
          endCursor,
        }
      },
    },
  },
})

type ServerResourceExposeType = {
  rpc: {
    [RESOURCE_DOWNLOAD_ENDPOINT](
      body: null,
      params: { _key: string; filename: string },
    ): Promise<RpcFile>
  }
}
