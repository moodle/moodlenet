import fileStoreFactory from '@moodlenet/simple-file-store/server'
import { shell } from '../shell.mjs'

export const resourceFiles = await fileStoreFactory(shell, 'resources')
export const publicFiles = await fileStoreFactory(shell, 'public')
export const publicFilesHttp = await publicFiles.mountStaticHttpServer('public')
