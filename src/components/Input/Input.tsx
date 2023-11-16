import { InputHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string
  classNameError?: string
  messageError?: string
  rules?: RegisterOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
}
export const Input = ({
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm text-start',
  classNameInput = 'p-3 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm',
  className,
  messageError,
  name,
  rules,
  register,
  ...rest
}: Props) => {
  const registerRules = register && name ? register(name, rules) : null
  return (
    <div className={className}>
      <input {...rest} {...registerRules} className={classNameInput} />
      <div className={classNameError}>{messageError}</div>
    </div>
  )
}
