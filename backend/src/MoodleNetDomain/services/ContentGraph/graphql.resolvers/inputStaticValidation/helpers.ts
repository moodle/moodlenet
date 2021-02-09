import * as Yup from 'yup'
import * as GQL from '../../ContentGraph.graphql.gen'

export function assertUnreachable(shouldBeNever: never): never {
  throw new Error(`Didn't expect to get here assertUnreachable ${shouldBeNever}`)
}

export const neverValidate = (name: string, msg: string) => Yup.object<never>().test(name, msg, () => false) as any

export const neverCreate = (type: GQL.NodeType | GQL.EdgeType) =>
  neverValidate('cannot create', `Cannnot create ${type}`)

export const neverUpdate = (type: GQL.NodeType | GQL.EdgeType) =>
  neverValidate('cannot update', `Cannnot update ${type}`)
