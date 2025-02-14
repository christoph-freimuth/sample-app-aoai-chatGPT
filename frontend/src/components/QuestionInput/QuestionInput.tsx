import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Stack, TextField } from '@fluentui/react'
import { useEffect, useState } from 'react'

import Send from '../../assets/Send.svg'
import { SendRegular } from '@fluentui/react-icons'
import styles from './QuestionInput.module.css'

interface Props {
  onSend: (question: string, id?: string) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
    clearTranscriptOnListen: true
  })

  useEffect(() => {
    setQuestion(transcript)
  }, [transcript])

  useEffect(() => {
    if (question.trim() === '') {
      resetTranscript()
    }
  }, [resetTranscript, question])

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return
    }

    if (conversationId) {
      onSend(question, conversationId)
    } else {
      onSend(question)
    }

    if (clearOnSend) {
      setQuestion('')
      resetTranscript()
    }
  }

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '')
  }

  const sendQuestionDisabled = disabled || !question.trim()

  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true })
  }

  const stopRecording = async () => {
    await SpeechRecognition.stopListening()
    sendQuestion()
  }

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
        styles={{
          fieldGroup: { height: '100%' },
          field: { height: '100%', fontSize: '1rem' },
          wrapper: { height: '100%' }
        }}
      />
      <Stack className={styles.buttonStack}>
        <button
          className={styles.voiceRecordingButton + (listening ? ` ${styles.active}` : ` ${styles.inactive}`)}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          onTouchCancel={stopRecording}
          disabled={!browserSupportsSpeechRecognition}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" rx="40" />
            <path
              d="M50 30V38M50 30C50 27.3478 48.9464 24.8043 47.0711 22.9289C45.1957 21.0536 42.6522 20 40 20C37.3478 20 34.8043 21.0536 32.9289 22.9289C31.0536 24.8043 30 27.3478 30 30V38C30 40.6522 31.0536 43.1957 32.9289 45.0711C34.8043 46.9464 37.3478 48 40 48C42.6522 48 45.1957 46.9464 47.0711 45.0711C48.9464 43.1957 50 40.6522 50 38M50 30H44M50 38H44M56 38C56 42.2435 54.3143 46.3131 51.3137 49.3137C48.3131 52.3143 44.2435 54 40 54M40 54C35.7565 54 31.6869 52.3143 28.6863 49.3137C25.6857 46.3131 24 42.2435 24 38M40 54V60M40 60H46M40 60H34"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </Stack>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  )
}
