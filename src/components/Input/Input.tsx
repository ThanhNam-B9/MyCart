import React from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props {
  className: string
  type: React.HTMLInputTypeAttribute
  autoComplete?: string
  placeholder?: string
  messageError?: string
  name: string
  rules?: RegisterOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
}

export const Input = ({ className, type, autoComplete, placeholder, messageError, name, rules, register }: Props) => {
  return (
    <div className={className}>
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...register(name, rules)}
        className='p-3 w-full outline-none border border-gray-500 rounded-sm focus:shadow-sm'
      />
      <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-start'>{messageError}</div>
    </div>
  )
}
