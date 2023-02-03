import { getOrgData, setOrgData } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    setOrgData: {
      guard: () => void 0,
      fn: setOrgData,
    },
    getOrgData: {
      guard: () => void 0,
      fn: getOrgData,
    },
    __________REMOVE_ME__test_files: {
      guard: () => void 0,
      async fn(body) {
        console.log({ __________REMOVE_ME__test_files_body: body })
        console.log({ __________REMOVE_ME__test_files_body_files: body.resource.xx })
        return body
      },
      bodyWithFiles: {
        fields: {
          '.resource.xx': 2,
        },
      },
    },
  },
})
