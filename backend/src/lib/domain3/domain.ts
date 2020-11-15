import { Concat } from 'typescript-tuple/lib/utils'
import { MoodleNetDomain } from '../../domain/MoodleNetDomain'
import { Domain, DomainName, PathTo, Pointer } from './types'

type Crawl<Point extends Pointer<PathTo.Any, any, any, string>> = (
  point: Point
) => Point['path'] extends PathTo.AnyLeaf
  ? Point
  : <
      Prop extends Concat<Point['path'], [Prop]> extends PathTo.AnyLeaf
        ? keyof Point['type'] | '*'
        : keyof Point['type']
    >(
      prop: Prop
    ) => ReturnType<
      Crawl<
        //@ts-expect-error
        Pointer<
          //@ts-expect-error
          Concat<Point['path'], [Prop extends '*' ? keyof Point['type'] : Prop]>,
          Point['type'][Prop extends '*' ? keyof Point['type'] : Prop],
          Point['type'],
          Prop // extends '*' ? keyof Point['type'] : Prop
        >
      >
    >

/* 
export const point = <Dom extends Domain>(
  domainName: DomainName<Dom>
): ReturnType<Crawl<Dom, Pointer<[DomainName<Dom>], Dom>>> => {
  return crawl({
    p: [domainName],
    //@ts-ignore
    _: { t: domainName, _: ({} as any) as Dom },
  }) as any
}

type Crawl<CType, Point extends Pointer<PathTo.Any, CType>> = (
  point: Point
) => Point['p'] extends PathTo.AnyLeaf
  ? Point
  : <
      Prop extends Concat<Point['p'], [Prop]> extends PathTo.AnyLeaf
        ? keyof CType | '*'
        : keyof CType
    >(
      prop: Prop
    ) => ReturnType<
      Crawl<
        CType[Prop extends '*' ? keyof CType : Prop],
        //@ts-ignore
        Pointer<
          Concat<Point['p'], [Prop extends '*' ? keyof CType : Prop]>,
          CType[Prop extends '*' ? keyof CType : Prop]
        >
      >
    >

*/

const _crawl = (point: Pointer<PathTo.Any, any, any, any>) => {
  // console.log('point', point, point.path.length, point.path[3], point.path[5])
  const more = (prop: string) => {
    return crawl({
      path: [...point.path, prop],
    } as any)
  }
  if (point.path.length < 5) {
    return more
  } else if (
    (point.path.length === 5 && point.path[3] === 'ev') ||
    (point.path.length === 6 && point.path[3] === 'wf' && point.path[5] === 'start') ||
    (point.path.length === 7 && point.path[3] === 'wf' && point.path[5] !== 'start')
  ) {
    return point
  } else return more
}
const crawl: Crawl<Pointer<PathTo.Any, any, any, any>> = _crawl as any

export const point = <Dom extends Domain>(
  domainName: DomainName<Dom>
): ReturnType<
  Crawl<Pointer<PathTo.P1<DomainName<Dom>>, Dom, { [k in DomainName<Dom>]: Dom }, DomainName<Dom>>>
> => {
  return crawl({
    path: [domainName],
  } as any) as any
}

// const x = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')('wf')('RegisterNewAccount')(
//   'start'
// )
// x
// const z = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')('wf')('RegisterNewAccount')(
//   'progress'
// )('WaitingConfirmEmail')
// const y = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')('ev')('*')
// y
