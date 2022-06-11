type PromiseResult<T> = { resolved: true; val: T } | { resolved: false; err: any }
type SequenceThunks<Tup extends readonly any[]> = readonly [
  ...{
    [K in keyof Tup]: () => Promise<Tup[K]>
  },
]
export async function sequencePromises<Tup extends readonly any[]>(
  thunks: SequenceThunks<Tup>,
): Promise<readonly [...{ [K in keyof Tup]: PromiseResult<Tup[K]> }]> {
  const results: any[] = []

  const thunkWraps = thunks.map(thunk => async () => {
    const resP = await thunk()
    results.push(resP)
  })

  await thunkWraps.reduce((prev, thunkWrap) => () => prev().then(thunkWrap))()

  return results as any
}
