import { redirect } from 'next/navigation'

export async function POST(req: Request) {
  const formData = await req.formData()
  console.log({ formData })
  redirect('/')
}

