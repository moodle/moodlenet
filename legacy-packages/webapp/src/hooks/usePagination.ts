import { Maybe } from '@moodlenet/common/dist/utils/types'
import { useFormik } from 'formik'
import { useCallback, useMemo } from 'react'
import { PageInfo } from '../graphql/pub.graphql.link'
import { FormikHandle } from '../ui/lib/formik'

interface Page<EdgeType> {
  edges: EdgeType[]
  pageInfo: PageInfo
  // totalCount: number
}
interface NextPageCursor {
  after: PageInfo['endCursor']
  before: undefined
}
interface PreviousPageCursor {
  before: PageInfo['startCursor']
  after: undefined
}
type PageUpdater<EdgeType> = (_: {
  prev: Page<EdgeType>
  fetched: Page<EdgeType>
}) => any //Page<EdgeType>;

// type FollowPageCursor = NextPageCursor | PreviousPageCursor
// type Fetch<EdgeType, Cursor extends FollowPageCursor> = (_: {
//   cursor: Cursor
//   isNext: Cursor extends PreviousPageCursor ? false : true
//   update: PageUpdater<EdgeType>
// }) => Promise<unknown>
type Fetch<EdgeType> = (
  _: (
    | {
        cursor: NextPageCursor
        isNext: true
      }
    | {
        cursor: PreviousPageCursor
        isNext: false
      }
  ) & {
    update: PageUpdater<EdgeType>
  }
) => Promise<unknown>

type BaseMngPage<Ready extends boolean> = {
  ready: Ready
}
interface MngPageInitialized<EdgeType>
  extends Page<EdgeType>,
    BaseMngPage<true> {
  next(): Promise<unknown>
  previous(): Promise<unknown>
}
interface MngPageUninitialized<EdgeType> extends BaseMngPage<false> {
  edges: EdgeType[]
}

export type MngPage<EdgeType> =
  | MngPageUninitialized<EdgeType>
  | MngPageInitialized<EdgeType>

export type FormikPaging = readonly [FormikHandle | null, FormikHandle | null]
export const useFormikPaging = <EdgeType>(
  page: MngPage<EdgeType>
): FormikPaging => {
  const nextPageFormik = useFormik({
    initialValues: {},
    onSubmit: useCallback(
      () => (page?.ready ? page.next() : undefined),
      [page]
    ),
  })
  const previousPageFormik = useFormik({
    initialValues: {},
    onSubmit: useCallback(
      () => (page?.ready ? page.previous() : undefined),
      [page]
    ),
  })
  return useMemo(
    () =>
      [
        page.ready && page.pageInfo.hasNextPage ? nextPageFormik : null,
        page.ready && page.pageInfo.hasPreviousPage ? previousPageFormik : null,
      ] as const,
    [nextPageFormik, previousPageFormik, page]
  )
}

export const usePagination = <EdgeType>(
  gqlPage: Maybe<Page<EdgeType>>,
  fetch: Fetch<EdgeType /* , NextPageCursor */> // = () => Promise.resolve()
): MngPage<EdgeType> & { formiks: FormikPaging } => {
  const page = useMemo<MngPage<EdgeType>>(
    () => mngPage(gqlPage, fetch),
    [gqlPage, fetch]
  )
  const formiks = useFormikPaging(page)
  return useMemo(
    () => ({
      ...page,
      formiks,
    }),
    [formiks, page]
  )
}

export const mngPage = <EdgeType>(
  page: Maybe<Page<EdgeType>>,
  fetch: Fetch<EdgeType /* , NextPageCursor */> = () => Promise.resolve()
): MngPage<EdgeType> => {
  if (!page) {
    return {
      ready: false,
      edges: [],
    }
  }
  const next: MngPageInitialized<EdgeType>['next'] = async () =>
    page.pageInfo.hasNextPage &&
    fetch({
      cursor: {
        after: page.pageInfo.endCursor,
        before: undefined,
      },
      update: updatePageNext,
      isNext: true,
    })

  const previous: MngPageInitialized<EdgeType>['previous'] = async () =>
    page.pageInfo.hasPreviousPage &&
    fetch({
      cursor: {
        before: page.pageInfo.startCursor,
        after: undefined,
      },
      update: updatePagePrev,
      isNext: false,
    })

  const pageMng: MngPage<EdgeType> = {
    ...page,
    next,
    previous,
    ready: !!page,
  }
  return pageMng
}

const updatePageNext = <EdgeType>({
  fetched,
  prev,
}: {
  fetched: Page<EdgeType>
  prev: Page<EdgeType>
}) => {
  return {
    ...fetched,
    edges: prev.edges.concat(fetched.edges),
    // // totalCount: fetched.totalCount,
    pageInfo: {
      ...prev.pageInfo,
      endCursor: fetched.pageInfo.endCursor,
      hasNextPage: fetched.pageInfo.hasNextPage,
    },
  }
}
const updatePagePrev = <EdgeType>({
  fetched,
  prev,
}: {
  fetched: Page<EdgeType>
  prev: Page<EdgeType>
}) => {
  return {
    ...fetched,
    edges: fetched.edges.concat(prev.edges),
    // // totalCount: fetched.totalCount,
    pageInfo: {
      ...prev.pageInfo,
      startCursor: fetched.pageInfo.startCursor,
      hasPreviousPage: fetched.pageInfo.hasPreviousPage,
    },
  }
}
