import { readableRpcFile } from '@moodlenet/core'
import { setCurrentUserFetch } from '@moodlenet/system-entities/server'
import { WebUserEntitiesTools } from '@moodlenet/web-user/server'
import { open, readFile, stat } from 'fs/promises'
import { resolve } from 'path'
import { shell } from '../shell.mjs'
import { env } from './env.mjs'

export function initiateCallForProfileKey({ _id, exec }: { _id: string; exec(): any }) {
  return shell.initiateCall(async () => {
    await setCurrentUserFetch(async () => {
      return {
        type: 'entity',
        entityIdentifier: WebUserEntitiesTools.getIdentifiersByIdAssertType({
          _id,
          type: 'Profile',
        }).entityIdentifier,
        restrictToScopes: false,
      }
    })
    return exec()
  })
}

export async function getRpcFileByV2AssetLocation(v2AssetLocation: string, warn: string) {
  const filePath = resolve(env.v2AssetFolder, 'assets', v2AssetLocation)
  const fileDescPath = `${filePath}.desc.json`
  const [statsFile, statsDesc] = await Promise.all([stat(filePath), stat(fileDescPath)]).catch(
    () => [null, null],
  )
  if (!(statsFile && statsDesc)) {
    shell.log('warn', `couldn't find file for V2AssetLocation: ${v2AssetLocation} - ${warn}`)
    return null
  }
  const fileDesc = JSON.parse(await readFile(fileDescPath, 'utf-8'))
  // shell.log('info', { filePath, fileDescPath, fileDesc })
  const rpcFile = readableRpcFile(
    {
      type: fileDesc.tempFileDesc.mimetype,
      name: fileDesc.tempFileDesc.name,
      size: fileDesc.tempFileDesc.size,
    },
    async () => {
      const fd = await open(filePath, 'r')
      const readable = fd.createReadStream({ autoClose: true })
      return readable
    },
  )
  return rpcFile
}
