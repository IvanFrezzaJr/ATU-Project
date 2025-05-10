import { useEffect, useState } from 'preact/hooks';

type Props = {
  message: string;
  type: 'error' | 'success';
  onClose?: () => void;
};

export const GlobalMessage = ({ message, type, onClose }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const className = type === 'error' ? 'contrast' : 'secondary';

  return (
    <div className={`container`}>
      <div className={`message ${className}`} style={{ marginBottom: '1rem' }}>
        {message}
      </div>
    </div>
  );
};
