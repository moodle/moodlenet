import PrimaryButton from '@/components/atoms/PrimaryButton/PrimaryButton'

export default async function PageLandingShareButton() {
  return (
    <PrimaryButton className="share-content" color="blue" onClick={undefined}>
      Publish content
    </PrimaryButton>
  )
}
