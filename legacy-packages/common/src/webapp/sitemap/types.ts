import { ExtractRouteParams } from './lib'

export type RouteDef<Path extends string, Params extends ExtractRouteParams<Path>> = {
  path: Path
  params: Params
}

export type GetRouteDefParams<R extends RouteDef<string, any>> = R['params']
export type GetRouteDefPath<R extends RouteDef<string, any>> = R['path']
