/* eslint-disable prettier/prettier */
import type { AddonItem } from '@moodlenet/component-library'
import { Card, MultipeSelectDropdown, PrimaryButton, Switch } from '@moodlenet/component-library'
import type { EdMetaOptionsProps } from '@moodlenet/ed-resource/common'
import { useFormik } from 'formik'
import { /* useState, */ type FC } from 'react'
import type { UserInterests } from '../../../../../../common/types.mjs'
import './General.scss'

export type InterestsOptions = Pick<
  EdMetaOptionsProps,
  'languageOptions' | 'levelOptions' | 'licenseOptions' | 'subjectOptions'
>
export type GeneralProps = {
  mainColumnItems: (AddonItem | null)[]
  interestsOptions: InterestsOptions
  interests: UserInterests
  editInterests: (values: UserInterests) => void
  useInterestsAsDefaultFilters: boolean
  toggleUseInterestsAsDefaultFilters: () => void
  // userId: string
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const General: FC<GeneralProps> = ({
  mainColumnItems,
  interestsOptions,
  interests,
  useInterestsAsDefaultFilters,
  editInterests,
  toggleUseInterestsAsDefaultFilters,
  //userId
}) => {
  const { languageOptions, levelOptions, subjectOptions, licenseOptions } = interestsOptions
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

  const form = useFormik<UserInterests & { useInterestsAsDefaultFilters: boolean }>({
    initialValues: { ...interests, useInterestsAsDefaultFilters },
    enableReinitialize: true,
    onSubmit: values => {
      editInterests(values)
      values.useInterestsAsDefaultFilters !== useInterestsAsDefaultFilters &&
        toggleUseInterestsAsDefaultFilters()
    },
  })

  const subjectsField = (
    <MultipeSelectDropdown
      name="subjects"
      onChange={form.handleChange}
      label="Subjects"
      placeholder="Content category"
      canEdit={true}
      key="subject-field"
      value={form.values.subjects}
      options={subjectOptions}
      errors={form.errors.subjects}
      shouldShowErrors={true}
    />
  )

  const levelsField = (
    <MultipeSelectDropdown
      name="levels"
      onChange={form.handleChange}
      label="Levels"
      placeholder="Content level"
      canEdit={true}
      key="level-field"
      value={form.values.levels}
      options={levelOptions}
      errors={form.errors.levels}
      shouldShowErrors={true}
    />
  )

  const languagesField = (
    <MultipeSelectDropdown
      name="languages"
      onChange={form.handleChange}
      label="Languages"
      placeholder="Content language"
      canEdit={true}
      key="language-field"
      value={form.values.languages}
      options={languageOptions}
      errors={form.errors.languages}
      shouldShowErrors={true}
    />
  )

  const licensesField = (
    <MultipeSelectDropdown
      name="licenses"
      onChange={form.handleChange}
      label="Licences"
      placeholder="Content license"
      canEdit={true}
      key="license-field"
      value={form.values.licenses}
      options={licenseOptions}
      errors={form.errors.licenses}
      shouldShowErrors={true}
    />
  )

  const setAsDefaultFilters = (
    <div className="set-as-default-filters">
      <div className="title">Use interests as default filters when searching</div>
      <Switch
        enabled={form.values.useInterestsAsDefaultFilters}
        toggleSwitch={() =>
          form.setFieldValue(
            'useInterestsAsDefaultFilters',
            !form.values.useInterestsAsDefaultFilters,
          )
        }
      />
    </div>
  )

  const interestsFields = [
    subjectsField,
    levelsField,
    languagesField,
    licensesField,
    setAsDefaultFilters,
  ]

  const interestsSection = (
    <Card className="column interests-section">
      <div className="parameter">
        <div className="name">Interests</div>
        {interestsFields}
      </div>
      <PrimaryButton
        disabled={!form.dirty}
        onClick={() => {
          form.submitForm()
        }}
      >
        Save
      </PrimaryButton>
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
