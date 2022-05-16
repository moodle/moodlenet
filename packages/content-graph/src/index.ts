import { reply } from '@moodlenet/kernel/lib/lib/port'
import { ContentGraph } from './types'

export default (pkgShell: Shell) => {
  pkgShell.manageAllPorts<ContentGraph>('MoodleNet/ContentGraph@1', {
    createNode: reply<ContentGraph>(pkgShell)('MoodleNet/ContentGraph::createNode')(_shell => async _ => ({
      newNode: {
        ..._,
        _kind: 'node',
        _id: `${_._type}/newnodekey`,
        _key: 'newnodekey',
      },
    })),
  })

  return {
    stop() {},
  }
}
