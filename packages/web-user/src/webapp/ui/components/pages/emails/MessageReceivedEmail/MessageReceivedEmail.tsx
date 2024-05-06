import EmailLayout, {
  EmailLayoutProps,
} from '../../../../../../../../component-library/src/webapp/ui/components/molecules/EmailLayout/EmailLayout.js'

export type MessageReceivedEmailProps = Partial<EmailLayoutProps> & {
  displayName: string
  message: string
  instanceName: string
}

export const MessageReceivedEmail = ({
  message,
  displayName,
  actionUrl,
  receiverEmail,
  instanceName,
}: MessageReceivedEmailProps) => {
  const title = `${displayName} send you a message 📨`
  return (
    <EmailLayout
      subject={title}
      content={message}
      title={title}
      actionTitle={`Reply at ${instanceName}`}
      actionUrl={actionUrl}
      receiverEmail={receiverEmail}
    />
  )
}
