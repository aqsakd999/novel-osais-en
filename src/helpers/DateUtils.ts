import dayjs, { Dayjs } from 'dayjs'

const getStartMonth = (value: Date) => {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0)
}

const getStartNextMonth = (value: Date) => {
  return new Date(value.getFullYear(), value.getMonth() + 1, value.getDate(), 0, 0, 0, 0)
}

const getDateString = (value?: Dayjs) => {
  if (!value) return null
  return dayjs(value).format('DD-MM-YYYY')
}

export default {
  getStartMonth,
  getStartNextMonth,
  getDateString,
}
