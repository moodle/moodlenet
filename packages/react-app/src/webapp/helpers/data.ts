export const hasNoValue = (_: any): _ is null | undefined | void => [null, undefined].includes(_)
