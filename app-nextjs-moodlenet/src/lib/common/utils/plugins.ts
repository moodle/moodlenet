export type plugins<k extends string, T> = Record<k, null | undefined | T[]>
