import { shell } from './shell.mjs'
type MyCollection = { collectionId: string }
export const expose = await shell.expose({
  rpc: {
    'webapp/getInteractionDetails': {
      guard: () => void 0,
      async fn({ collectionId }: { collectionId: string }): Promise<MyCollection | null> {
        return {
          collectionId,
        }
      },
    },
  },
})
