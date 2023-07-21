import { Modal } from '@moodlenet/component-library'
import { useCallback, useContext, useReducer } from 'react'
import { MyLmsContext } from '../../rt/myLmsContext.js'
import { useSendToLMS } from '../../rt/send-to-moodle/useSendToLms.mjs'

export function SendResourceToMoodleButton(/* {}: {} */) {
  const { defaultSiteTarget } = useContext(MyLmsContext)
  const { canSend, sendToLMS } = useSendToLMS()
  const [modalOpen, toggleModal] = useReducer((open: boolean) => !open, false)
  const sendResourceToLMS = useCallback(() => {
    sendToLMS(defaultSiteTarget)
  }, [defaultSiteTarget, sendToLMS])
  if (!canSend) {
    return null
  }
  return (
    <>
      <button onClick={toggleModal}>Send to Moodle</button>
      {modalOpen && (
        <Modal
          actions={<button onClick={sendResourceToLMS}>Send</button>}
          closeButton={true}
          onClose={toggleModal}
          title="Send to Moodle"
        ></Modal>
      )}
    </>
  )
}
