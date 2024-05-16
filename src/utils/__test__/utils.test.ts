import { AxiosError, isAxiosError } from 'axios'
import { describe, expect, it } from 'vitest'
import { isAxiosUnprocessableEntityError } from '../utils'

describe('isAxiosError', () => {
  it('isAxiosError trả về boolean', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosUnprocessableEntityError', () => {
  it('isAxiosError trả về boolean', () => {
    expect(isAxiosUnprocessableEntityError(new Error())).toBe(false)
    expect(isAxiosUnprocessableEntityError(new AxiosError())).toBe(true)
  })
})
