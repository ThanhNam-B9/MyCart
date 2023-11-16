import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = {
  [key in 'email' | 'password' | 'repassword']?: RegisterOptions
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Không vượt quá số 160 kí tự!' // JS only: <p>error message</p> TS only support string
    },
    minLength: {
      value: 8,
      message: 'Ít nhát 8 kí tự' // JS only: <p>error message</p> TS only support string
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Không vượt quá số 16 kí tự!' // JS only: <p>error message</p> TS only support string
    },
    minLength: {
      value: 8,
      message: 'Ít nhát 8 kí tự' // JS only: <p>error message</p> TS only support string
    }
  },
  repassword: {
    required: {
      value: true,
      message: 'Nhập lại mật khẩu là bắt buộc!'
    },
    maxLength: {
      value: 160,
      message: 'Không vượt quá số 16 kí tự!' // JS only: <p>error message</p> TS only support string
    },
    minLength: {
      value: 8,
      message: 'Ít nhát 8 kí tự' // JS only: <p>error message</p> TS only support string
    },
    validate: (value) =>
      typeof getValues === 'function' ? getValues('password') === value || 'Mật khẩu không khớp !' : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== ' ' && price_max !== '') {
    return Number(price_min) <= Number(price_max)
  }
  return price_min !== '' || price_max !== ''
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Ít nhất 5 kí tự')
    .max(160, 'Không quá 100 kí tự'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Ít nhất 6 kí tự').max(160, 'Không quá 160 kí tự'),
  repassword: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Ít nhất 6 kí tự')
    .max(160, 'Không quá 160 kí tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp !'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Nhập tên là bắt buộc!')
})

// export const loginShema = schema.omit(['repassword'])
// export type loginShema = yup.InferType<typeof loginShema>
export type Schema = yup.InferType<typeof schema>
