import React from 'react'
import { TextField } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

export type NumberInputFormProps = {
  name: string
  control?: Control
  onChange?: (value: number) => void
} & NumericFormatProps

const NumberInputForm: React.FC<NumberInputFormProps> = (props: NumberInputFormProps) => {
  const { name, onChange, control, ...rest } = props
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: handleChangeRender, value } }) => (
          // @ts-ignore
          <NumericFormat
            {...rest}
            customInput={TextField}
            value={value}
            thousandSeparator
            onChange={(event) => {
              const value = parseFloat(event.target?.value)
              handleChangeRender(value)
              if (onChange) {
                onChange(value)
              }
              return value
            }}
          />
        )}
      />
    )
  } else {
    return (
      // @ts-ignore
      <NumericFormat
        {...rest}
        customInput={TextField}
        thousandSeparator
        name={name}
        onChange={(event) => {
          if (onChange) {
            onChange(parseFloat(event?.target.value))
          }
        }}
      />
    )
  }
}

export default NumberInputForm
