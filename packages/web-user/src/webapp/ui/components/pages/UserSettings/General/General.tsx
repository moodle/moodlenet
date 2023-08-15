/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import { Card } from '@moodlenet/component-library'
import { SubjectMultipleField } from '@moodlenet/ed-meta/ui'
import type { EdMetaOptionsProps, ResourceFormProps } from '@moodlenet/ed-resource/common'
import { useFormik } from 'formik'
import { /* useState, */ type FC } from 'react'
import './General.scss'

export type GeneralProps = {
  mainColumnItems: (AddonItem | null)[]
  edMetaOptions: EdMetaOptionsProps
  resourceForm: ResourceFormProps
  // userId: string
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const General: FC<GeneralProps> = ({
  mainColumnItems,
  edMetaOptions,
  resourceForm,
  //userId
}) => {
  const {
    languageOptions,
    levelOptions,
    licenseOptions,
    monthOptions,
    subjectOptions,
    typeOptions,
    yearOptions,
  } = edMetaOptions
  /* const [showUserIdCopiedAlert, setShowUserIdCopiedAlert] = useState<boolean>(false)

  const copyId = () => {
    navigator.clipboard.writeText(userId)
    setShowUserIdCopiedAlert(false)
    setTimeout(() => {
      setShowUserIdCopiedAlert(true)
    }, 100)
  } 

  const detailsSection = (
    <Card className="column details-section">
      <div className="parameter">
        <div className="name user-id">
          User ID
          <span>To connect with Moodle LMS</span>
        </div>
        <div className="actions">
          {userId}{' '}
          <abbr className={`user-id`} title={`Click to copy your ID to the clipboard`}>
            <SecondaryButton className="copy-id" onClick={copyId}>
              Copy
            </SecondaryButton>
          </abbr>
        </div>
      </div>
    </Card>
  )*/

  const form = useFormik<ResourceFormProps>({
    initialValues: resourceForm,
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: () => {
      // values => {
      console.log('changes saved')
      // return editData(values)
    },
  })

  const subjectField = (
    <SubjectMultipleField
      canEdit={true}
      key="subject-field"
      subjects={[form.values.subject]}
      subjectOptions={subjectOptions}
      error={form.errors.subject}
      editSubject={e => form.setFieldValue('subject', e)}
      shouldShowErrors={true}
    />
  )

  const interestsSection = (
    <Card className="column interests-section">
      <div className="parameter">
        <div className="name">Interests</div>
        {subjectField}
      </div>
    </Card>
  )

  const snackbars = [
    // <SnackbarStack
    //   snackbarList={[
    //     <Snackbar
    //       key="csds"
    //       type="success"
    //       position="bottom"
    //       autoHideDuration={3000}
    //       showCloseButton={false}
    //     >
    //       User ID copied to the clipboard
    //     </Snackbar>,
    //     <Snackbar key={'sd'} autoHideDuration={3000} type="success">
    //       Heyy
    //     </Snackbar>,
    //   ]}
    // ></SnackbarStack>,
    <></>,
  ]

  // const snackbarsStack =
  // <SnackbarStack
  // snackbarList=        [
  // showUserIdCopiedAlert ? (
  //   <Snackbar
  //     type="success"
  //     position="bottom"
  //     autoHideDuration={6000}
  //     showCloseButton={false}
  //   >
  //     User ID copied to the clipboard
  //   </Snackbar>
  // ) : null,

  // }
  // ></SnackbarStack>

  const updatedMainColumnItems = [
    //detailsSection,
    interestsSection,
    ...(mainColumnItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const modals = [<></>]
  return (
    <div className="general" key="general">
      {modals}
      {snackbars}
      <Card className="column">
        <div className="title">General</div>
      </Card>
      {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
    </div>
  )
}
