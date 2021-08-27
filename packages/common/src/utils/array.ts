export const isJust = <J>(_: J | null | undefined): _ is J => (_ !== null && _ !== void 0 ? true : false)

export const isOneOf =
  <T extends number | string>(stack: readonly T[]) =>
  (_: any): _ is T =>
    stack.includes(_)
