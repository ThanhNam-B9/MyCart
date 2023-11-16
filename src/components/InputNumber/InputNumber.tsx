import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
  messageError?: string // eslint-disable-next-line @typescript-eslint/no-explicit-any
}
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm text-start',
    classNameInput = 'p-3 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm',
    className,
    messageError,
    onChange,
    ...rest
  },
  ref
) {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input {...rest} className={classNameInput} onChange={handleOnChange} ref={ref} />
      <div className={classNameError}>{messageError}</div>
    </div>
  )
})
export default InputNumber
