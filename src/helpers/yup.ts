import * as yupImp from 'yup'

export const yupNumber = () => {
  return yupImp
    .number()
    .nullable()
    .transform((value) => (Number.isNaN(value) ? null : value))
}

export const yup = yupImp

export const yupDate = () => {
  return yupImp
    .date()
    .nullable()
    .transform((value) => (Number.isNaN(new Date(value).getTime()) ? null : value))
}
