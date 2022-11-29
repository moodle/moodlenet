//1
export type K<Op extends string, T extends string> = D<Op, T> & W<Op, T>
export type D<Op extends string, T extends string> = Y<Op, T> & Z<Op, T>
export type Y<Op extends string, T extends string> = (sub: K<Op, T>) => K<Op, T>
export type W<Op, T> = (() => string) & { _?: [Op, T] }
export type Z<Op extends string, T extends string> = {
  [o in Op]: J<Op, T>
}
export type J<Op extends string, T extends string> = Y<Op, T> & X<Op, T>
export type X<Op extends string, T extends string> = {
  [t in T]: K<Op, T>
}

export const _op_chain = <Op extends string, T extends string>(str_or_k: string | K<Op, T> = ''): K<Op, T> => {
  if (typeof str_or_k !== 'string') {
    const k = str_or_k
    return _op_chain<Op, T>(`( ${k()} )`)
  }
  const str = str_or_k
  const kfn = (sub: K<Op, T>) => {
    return sub ? _op_chain<Op, T>(`${str} ( ${sub()} )`) : `${str}`
  }
  return new Proxy(kfn, {
    get: (_trg, p) => _op_chain(`${str ? str + ' ' : ''}${String(p)}`),
  }) as K<Op, T>
}
export const op_chain = _op_chain as any as <Op extends string, T extends string>() => X<Op, T> &
  K<Op, T> & { _?: W<Op, T> }

export type AssertionOf<_> = _ extends K<infer Op, infer T> ? W<Op, T> : never
export type BoolOp = 'AND' | 'OR'
/*
type BoolAssert<T extends string> = K<BoolOp, T>

type AssertionsType = 'A' | 'B' | 'C'
type Assertion = BoolAssert<AssertionsType>

declare const A: Assertion
declare const B: Assertion
declare const C: Assertion
declare const BB: Assertion

A.and.B.or.C.and(A.and.B.and.C)
const c = A.or.A.and(C.or(A))
const d = A.or(A)

const z = A.and.B.or(A.and.B)()

*/
