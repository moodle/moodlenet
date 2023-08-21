/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import { Card, MultipeSelectDropdown } from '@moodlenet/component-library'
import type { EdMetaOptionsProps } from '@moodlenet/ed-resource/common'
import { useFormik } from 'formik'
import { /* useState, */ type FC } from 'react'
import type { UserInterests } from '../../../../../../common/types.mjs'
import './General.scss'

export type GeneralProps = {
  mainColumnItems: (AddonItem | null)[]
  edMetaOptions: EdMetaOptionsProps
  interests: UserInterests
  editInterests: (values: UserInterests) => void
  // userId: string
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const General: FC<GeneralProps> = ({
  mainColumnItems,
  edMetaOptions,
  interests,
  editInterests,
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

  const form = useFormik<UserInterests>({
    initialValues: interests,
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: values => {
      console.log('changes saved')
      editInterests(values)
      // return editData(values)
    },
  })

  const subjectsField = (
    <MultipeSelectDropdown
      label="Subjects"
      placeholder="Content category"
      canEdit={true}
      key="subject-field"
      selections={form.values.subjects}
      options={subjectOptions}
      errors={form.errors.subjects}
      edit={e => form.setFieldValue('subjects', e)}
      shouldShowErrors={true}
    />
  )

  const levelsField = (
    <MultipeSelectDropdown
      label="Levels"
      canEdit={true}
      key="level-field"
      selections={form.values.levels}
      options={levelOptions}
      errors={form.errors.subjects}
      edit={e => form.setFieldValue('levels', e)}
      shouldShowErrors={true}
    />
  )

  const languagesField = (
    <MultipeSelectDropdown
      label="Languages"
      canEdit={true}
      key="level-field"
      selections={form.values.languages}
      options={languageOptions}
      errors={form.errors.languages}
      edit={e => form.setFieldValue('languages', e)}
      shouldShowErrors={true}
    />
  )

  const interestsFields = [subjectsField, levelsField, languagesField]

  const interestsSection = (
    <Card className="column interests-section">
      <div className="parameter">
        <div className="name">Interests</div>
        {interestsFields}
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
