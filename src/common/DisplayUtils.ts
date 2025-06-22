import { LabelAndValue } from './type'

export const getLabel = (options: LabelAndValue[], value?: string[] | string) => {
  if (!value) return
  if (Array.isArray(value)) {
    return (options || [])
      ?.filter((it) => value.includes(it.value))
      .map((it) => it.label)
      .join(', ')
  }
  return (options || [])?.find((it) => it.value === value)?.label as string
}
