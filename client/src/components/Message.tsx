import { useState } from 'preact/hooks'

interface MessageProps {
  title: string
  message: string
  onClose?: () => void
}

const Message = ({ title, message, onClose }: MessageProps) => {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  return (
    <dialog open>
      <article>
        <header>
          <p>
            <strong>{title}</strong>
          </p>
        </header>
        <p>{message}</p>
        <footer>
          <button onClick={handleClose}>OK</button>
        </footer>
      </article>
    </dialog>
  )
}

export default Message
