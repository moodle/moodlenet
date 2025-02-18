import { isRight, right } from 'fp-ts/Either'

export async function setup({ modelHandle }: { modelHandle: moo.model.handle }) {
  const e_modelCheck = await modelCheck({ modelHandle })
  if (isRight(e_modelCheck)) {
    return
  }
  return upgrade({ modelHandle })
}

export async function modelCheck({ modelHandle }: { modelHandle: moo.model.handle }) {
  return right(true)
}

export async function upgrade({ modelHandle }: { modelHandle: moo.model.handle }) {
  return right(true)
}
