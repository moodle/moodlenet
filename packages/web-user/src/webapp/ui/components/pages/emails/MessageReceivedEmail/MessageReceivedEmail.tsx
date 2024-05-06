import EmailLayout, {
  EmailLayoutProps,
} from '../../../../../../../../component-library/src/webapp/ui/components/molecules/EmailLayout/EmailLayout.js'

export type MessageReceivedEmailProps = Partial<EmailLayoutProps> & {
  displayName: string
  message: string
}

export const MessageReceivedEmail = ({
  message,
  displayName,
  actionUrl,
  receiverEmail,
}: MessageReceivedEmailProps) => {
  const title = `${displayName} send you a message 📨`
  return (
    <EmailLayout
      subject={title}
      content={message}
      title={title}
      actionTitle="Reply at MoodleNet"
      actionUrl={actionUrl}
      receiverEmail={receiverEmail}
      // actionButtonStyle={{ backgroundColor: '#4CAF50', color: 'white' }}
    />
  )
}
