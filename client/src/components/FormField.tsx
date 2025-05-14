type Props = {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: Event) => void
  onBlur?: (e: Event) => void
  error?: string
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
}: Props) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} type={type} value={value} onInput={onChange} onBlur={onBlur} />
    {error && <small style={{ color: 'red' }}>{error}</small>}
  </div>
)
