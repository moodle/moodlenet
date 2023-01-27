export type SelectOptions<O, S = O> = {
  // export type SelectOptions<O, S extends any = O> = {
  opts: O[]
  selected?: S
}
export type SelectOptionsMulti<O, S = O> = {
  // export type SelectOptionsMulti<O, S extends any = O> = {
  opts: O[]
  selected: S[]
}
