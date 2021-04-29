//FIXME: sssscopied this in common.
// remove this and point to common
export const isJust = <J>(_: J | null | undefined): _ is J => (_ !== null && _ !== void 0 ? true : false)
