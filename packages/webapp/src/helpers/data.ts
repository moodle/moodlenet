export const isJust = <J>(_: J | null | undefined): _ is J => (_ !== null && _ !== void 0 ? true : false)
