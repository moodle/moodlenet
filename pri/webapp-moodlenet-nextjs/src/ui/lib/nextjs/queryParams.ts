import { usePathname, useRouter, useSearchParams } from 'next/navigation'

//CREDIT: https://github.com/vercel/next.js/discussions/47583#discussioncomment-6379219
export default function useQueryParams<T>() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSearchParams = new URLSearchParams(Array.from(searchParams.entries()))

  function setQueryParams(params: Partial<T>) {
    Object.entries(params).forEach(([key, value]) => {
      urlSearchParams.set(key, String(value))
    })

    const search = urlSearchParams.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
  }

  return { urlSearchParams, setQueryParams }
}
