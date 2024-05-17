import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { Schema, schema } from 'src/utils/rules'
import useQueryConfig from './useQueryConfig'
import omit from 'lodash/omit'
type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])
export default function useSearchProducts() {
  const navigate = useNavigate()
  const queryQuery = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryQuery.order
      ? omit(
          {
            ...queryQuery,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryQuery,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return { onSubmitSearch, register }
}
