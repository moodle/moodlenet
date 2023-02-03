import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    'webapp/xxxx/xxx': {
      guard: () => void 0,
      fn: async ({ param }: { param: string }): Promise<{ str: string }> => {
        return { str: param }
      },
    },
  },
})
