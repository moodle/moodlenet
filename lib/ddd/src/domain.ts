declare const _: unique symbol

export interface Domain {
  [_]?: never
}
