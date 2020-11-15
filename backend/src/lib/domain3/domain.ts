import { Concat } from 'typescript-tuple/lib/utils'
import { MoodleNetDomain } from '../../domain/MoodleNetDomain'
import { Domain, DomainName, PathTo, Pointer } from './types'

export const point = <Dom extends Domain>(
  domainName: DomainName<Dom>
): ReturnType<Crawl<Dom, Pointer<[DomainName<Dom>], Dom>>> => {
  return crawl({
    p: [domainName],
    _: {} as Dom,
  }) as any
}

type Crawl<CType, Point extends Pointer<PathTo.Any, CType>> = (
  point: Point
) => Point['p'] extends PathTo.AnyLeaf
  ? Point
  : <Prop extends keyof CType>(
      prop: Prop
    ) => ReturnType<
      Crawl<
        CType[Prop],
        //@ts-ignore
        Pointer<Concat<Point['p'], [Prop]>, CType[Prop]>
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
const _crawl = (point: Pointer<PathTo.Any, any>) => {
  console.log('point', point, point.p.length, point.p[3], point.p[5])
  const more = (prop: string) => {
    return crawl({
      p: [...point.p, prop],
      _: undefined,
    })
  }
  if (point.p.length < 5) {
    return more
  } else if (
    (point.p.length === 5 && point.p[3] === 'ev') ||
    (point.p.length === 6 && point.p[3] === 'wf' && point.p[5] === 'start') ||
    (point.p.length === 7 && point.p[3] === 'wf' && point.p[5] !== 'start')
  ) {
    return point
  } else return more
}
const crawl: Crawl<any, Pointer<any, any>> = _crawl as any

point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')('wf')('RegisterNewAccount')('progress')(
  'WaitingConfirmEmail'
)
