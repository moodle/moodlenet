export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]> | T[P]
}

// subtype https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}
export type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base]
export type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>
//
export type Just<T> = Exclude<T, null | undefined>
export type Maybe<T> = T | null | undefined

//https://stackoverflow.com/a/57103940/1455910
export type DistOmit<T, K extends keyof T> = T extends any ? Omit<T, K> : never
