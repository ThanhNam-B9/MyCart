import { useState } from 'react'
import InputNumber, { InputNumberProps } from '../InputNumber'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  value?: number
  classNameWrapper?: string
}
export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  value,
  classNameWrapper = 'ml-10'
}: Props) {
  const [localValue, setLocalValue] = useState(value || 0)

  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && value && value >= max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }
  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }
  const ontype = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      value = value && value - 1
    }
    onType && onType(_value)
    setLocalValue(_value)
  }
  const handleOnBlurValue = () => {
    let _value = Number(value)
    console.log('_value', _value)

    if (_value <= 0) {
      _value = 1
      onType && onType(_value)
    }
  }
  return (
    <div className={'flex items-center ' + classNameWrapper}>
      <button
        className='flex items-center justify-center h-8 w-8 rounded-l-sm border border-gray-300 text-gray-600'
        onClick={decrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        value={value || localValue}
        className=''
        classNameError=''
        classNameInput='h-8 w-14 border-y border-gray-300 p-1 text-center outline-none'
        onChange={(e) => ontype(e)}
        onBlur={handleOnBlurValue}
      />
      <button
        className=' flex items-center justify-center h-8 w-8 rounded-r-sm border border-gray-300 text-gray-600'
        onClick={increase}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-4 h-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
