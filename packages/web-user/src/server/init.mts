import { setEdResourceMachineService } from '@moodlenet/ed-resource/server'
import { provideEdResourceMachineDepsAndInits } from './xsm/resource/machines.mjs'

await import('./init/persistence-upgrade.mjs')
await import('./init/kvStore.mjs')
await import('./init/arangodb.mjs')
await import('./init/fs.mjs')
await import('./init/sys-entities.mjs')
await import('./init/http-server.mjs')
await import('./init/react-app.mjs')
await import('./expose.mjs')

setEdResourceMachineService(provideEdResourceMachineDepsAndInits)
