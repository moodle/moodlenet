import { FormikHandle } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'

type MyProps = {
  addToCollectionsForm: FormikHandle<{ collections: string[] }>
  sendToMoodleLmsForm: FormikHandle<{ site?: string }>
}

export const useResourceCollectionProps = (actions: {
  add: (str: string) => void
  remove: (str: string) => void
}): MyProps => {
  const addToCollectionsForm: FormikHandle<{ collections: string[] }> = useFormik<{
    collections: string[]
  }>({
    initialValues: { collections: [] },
    // onSubmit() {},
    async onSubmit() {
      return
    },
    validate({ collections: curr }) {
      const prev = addToCollectionsForm.values.collections
      const toAdd = curr.filter(_ => !prev.includes(_))[0]
      const toRemove = prev.filter(_ => !curr.includes(_))[0]
      toAdd && actions.add(toAdd)
      toRemove && actions.remove(toRemove)
    },
  })

  const sendToMoodleLmsForm = useFormik<{ site?: string }>({
    initialValues: { site: 'http://my-lms.org' },
    async onSubmit() {
      actions.remove('Send to Moodle LMS')
    },
  })
  return { addToCollectionsForm, sendToMoodleLmsForm }
}
