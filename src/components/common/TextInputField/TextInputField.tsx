import React, { ReactNode } from 'react'
import TextInput, { TextInputProps } from './TextInput'
import InlineForm from '../Form/InlineForm'

type Props = {
  id: string
  name: string
  required?: boolean
  label?: ReactNode
  labelWidth?: number
  errorMessage?: ReactNode
  tooltip?: string
  height?: string
} & TextInputProps

const TextInputField: React.FC<Props> = (props: Props) => {
  const {
    id,
    name,
    required,
    suffix,
    label = '',
    labelWidth,
    error,
    disabled,
    errorMessage,
    tooltip,
    style,
    height,
    ...others
  } = props

  return (
    <InlineForm
      id={id}
      label={labelWidth === 0 ? undefined : label}
      suffix={suffix}
      labelWidth={labelWidth}
      required={labelWidth === 0 ? undefined : required}
      error={error}
      disabled={disabled}
      tooltip={tooltip}
      errorMessage={errorMessage}
      height={height}
    >
      <TextInput
        id={id}
        name={name}
        error={error}
        style={style}
        label={labelWidth !== 0 ? undefined : label}
        disabled={disabled}
        required={labelWidth !== 0 ? undefined : required}
        {...others}
      />
    </InlineForm>
  )
}

export default TextInputField
