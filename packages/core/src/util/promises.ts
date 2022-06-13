export type SeqPromiseResult<T> = { resolved: true; val: T } | { resolved: false; err: any }
export type SequenceThunks<Tup extends readonly any[]> = readonly [
  ...{
    [K in keyof Tup]: () => Promise<Tup[K]>
  },
]

export async function sequencePromises<Tup extends ReadonlyArray<any>>(
  thunks: SequenceThunks<Tup>,
): Promise<readonly [...{ [K in keyof Tup]: SeqPromiseResult<Tup[K]> }]> {
  const results: any[] = []

  const thunkWraps = thunks.map(thunk => async () => {
    const resP = await thunk()
    results.push(resP)
  })

  await thunkWraps.reduce((prev, thunkWrap) => () => prev().then(thunkWrap))()

  return results as any
}

/*
 */
// declare const pn:()=>Promise<number>
// declare const ps:()=>Promise<string>
// async function x(){

//   const sr = await sequencePromises([pn,ps,pn])
//   const x = sr[0]
//   const y = sr[1]
//   const z = sr[2]
//   const k = sr[3]
// }
