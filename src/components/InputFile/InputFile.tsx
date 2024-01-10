import { Fragment, useRef } from 'react'
import Button from '../Button'
import { toast } from 'react-toastify'
import { config } from 'src/constants/config'

interface Props {
  //   setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleOnChaneUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploadImg = e.target.files?.[0]
    if (fileUploadImg && (fileUploadImg?.size >= config.maxSizeUploadAvatar || !fileUploadImg.type.includes('image'))) {
      toast.error('Dung lượng không vượt quá 1MB và đinh dạng ảnh : PNG ,JPG ,JpGE')
    } else {
      //   setFile(fileUploadImg)
      onChange && onChange(fileUploadImg)
    }
  }
  const handleUploadFile = () => {
    fileInputRef.current?.click()
  }
  return (
    <Fragment>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={handleOnChaneUpload}
        onClick={(e) => {
          ;(e.target as HTMLTextAreaElement).value = ''
        }}
      />
      <Button
        type='button'
        className=' flex items-center justify-end outline-none bg-white border border-solid border-gray-400 h-8 px-5 rounded-sm text-gray-600 text-sm shadow-sm'
        onClick={handleUploadFile}
      >
        Chọn ảnh
      </Button>
    </Fragment>
  )
}
