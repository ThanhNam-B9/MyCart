import { range } from 'lodash'
import { useEffect, useState } from 'react'
interface Props {
  onChange?: (value: Date) => void
  errorMessage?: string
  value?: Date
}

function DateSelect({ errorMessage, onChange, value }: Props) {
  const [date, setDate] = useState({
    day: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })
  const handleOnChangeDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    const newDate = {
      ...date,
      [name]: value
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.day))
  }
  useEffect(() => {
    if (value) {
      setDate({
        day: value?.getDate(),
        month: value?.getMonth(),
        year: value?.getFullYear()
      })
    }
  }, [value])
  return (
    <div className='sm:mt-2 sm:flex flex-wrap'>
      <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between '>
          <select
            className='h-9 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange outline-none'
            onChange={handleOnChangeDate}
            name='day'
            value={value?.getDate() || date.day}
          >
            <option value={0} disabled>
              Ngày
            </option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className='h-9 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange outline-none'
            onChange={handleOnChangeDate}
            name='month'
            value={value?.getMonth() || date.month}
          >
            <option value={-1} disabled>
              Tháng
            </option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            className='h-9 w-[32%] rounded-sm border border-black/10 px-3 cursor-pointer hover:border-orange outline-none'
            onChange={handleOnChangeDate}
            name='year'
            value={value?.getFullYear() || date.year}
          >
            <option value={0} disabled>
              Năm
            </option>
            {range(1990, Number(new Date().getFullYear()) + 1).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-start'>{errorMessage}</div>
      </div>
    </div>
  )
}

export default DateSelect
