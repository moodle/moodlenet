import type { AssetInfo } from '@moodlenet/component-library/common'
import { matchState, nameMatcher } from '@moodlenet/core-domain/resource'
import { waitFor } from 'xstate/lib/waitFor'
import { stdEdResourceMachine } from './exports.mjs'
import { publicFilesHttp } from './init/fs.mjs'
import type { Image } from './types.mjs'
import type { ProvideBy } from './xsm/machines.mjs'

export function getImageUrl(image: Image | undefined | null) {
  if (!image) {
    return null
  }
  const imageUrl =
    image.kind === 'file'
      ? publicFilesHttp.getFileUrl({ directAccessId: image.directAccessId })
      : image.url

  return imageUrl
}

export function getImageAssetInfo(image: Image | undefined | null): AssetInfo | null {
  const location = getImageUrl(image)
  if (!(image && location)) {
    return null
  }

  const assetInfo: AssetInfo = {
    location,
    credits: image.kind === 'url' ? (image.credits ?? null) : null,
  }

  return assetInfo
}

interface EnsureUnpubOpts {
  onlyIfPublished?: boolean
}
export async function ensureUnpublish(provideBy: ProvideBy, opts?: EnsureUnpubOpts) {
  const [interpreter, , , , storedStatus] = await stdEdResourceMachine(provideBy)
  const snap = interpreter.getSnapshot()
  const event =
    opts?.onlyIfPublished && !matchState(snap, 'Published')
      ? null
      : matchState(snap, 'Published') || matchState(snap, 'Publish-Rejected')
        ? 'unpublish'
        : matchState(snap, 'Autogenerating-Meta')
          ? 'cancel-meta-generation'
          : matchState(snap, 'Meta-Suggestion-Available')
            ? ({ type: 'provide-resource-edits', edits: {} } as const)
            : null
  // console.log(snap.value, '-> event', event)
  if (event) {
    interpreter.send(event)
    await waitFor(interpreter, nameMatcher('Unpublished')) /* .catch(e => {
      console.error(event, 'event not done error', e)
      throw e
    }) */
    // console.log(event, 'event done', interpreter.getSnapshot().context.doc.id)
    interpreter.stop()
    await storedStatus
  }
  interpreter.stop()
  return
}
