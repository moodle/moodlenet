import './styles.scss'

export type AddToCollectionsFormValues = Partial<{
  collections: string
}>
export type AddToCollectionsProps = {
  step: 'AddToCollectionsStep'
  previousStep: (() => unknown) | undefined
  nextStep: (() => unknown) | undefined
  collections: [list: SimpleOpt[], selected: SimpleOpt[]]
}

type SimpleOpt = [key: string, label: string]
