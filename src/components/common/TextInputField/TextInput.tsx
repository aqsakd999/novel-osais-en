import { TextField } from '@mui/material'
import React, { ReactNode } from 'react'
import { Controller, Control } from 'react-hook-form'

type InnerProps = {
  type?: 'text' | 'password' | 'tel' | 'email' | 'textarea' | 'zip' | 'number'
  label?: string
  variant?: 'standard' | 'filled' | 'outlined' | undefined
  id: string
  helperText?: string
  numberMin?: number
  numberMax?: number
  style?: React.CSSProperties
  required?: boolean
  name: string
  autoFocus?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  value?: string
  placeholder?: string
  maxLength?: number
  imeMode?: 'auto' | 'active' | 'inactive' | 'disabled'
  rowsMin?: number | string
  rowsMax?: number | string
  onChange?: (value: object) => void
  onEnter?: (value: object) => void
  errorMessage?: string
  defaultValue?: string
  prefix?: ReactNode
  suffix?: ReactNode
  fullWidth?: boolean
  autoCompleteOptions?: Array<string>
  onBlurFunc?: (value: string) => void
  onKeyDown?: (event: string) => void
  className?: string
  disableTrim?: boolean
}

const convertInputType = (type: string) => {
  switch (type) {
    case 'email':
      return 'email'
    case 'number':
      return 'number'
    case 'password':
      return 'password'
    case 'tel':
    case 'text':
    case 'textarea':
    case 'zip':
    default:
      return 'text'
  }
}

const InnerTextInput: React.FC<InnerProps> = (props: InnerProps) => {
  const {
    type = 'text',
    id,
    label,
    errorMessage,
    name,
    variant = 'standard',
    value = '',
    style,
    required,
    maxLength,
    imeMode,
    autoFocus,
    fullWidth,
    disabled,
    readOnly,
    placeholder,
    rowsMin,
    rowsMax,
    onChange,
    onEnter,
    onKeyDown,
    defaultValue,
    prefix,
    suffix,
    onBlurFunc,
    className,
    disableTrim,
    helperText,
    numberMin,
    numberMax,
  } = props
  const inputType = convertInputType(type)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (onChange) {
      if (inputType === 'number') {
        const numValue = parseFloat(newValue)
        if (!isNaN(numValue)) {
          if (numberMin !== undefined && numberMin !== null && numValue < numberMin) {
            return
          }
          if (numberMax && numValue > numberMax) {
            return
          }
        }
      }
      onChange(event)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const tv = disableTrim ? event.target.value : event.target.value.trim()
    if (onChange && !disableTrim) {
      if (tv !== value) {
        onChange(event)
      }
    }

    if (onBlurFunc) {
      onBlurFunc(tv)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      // @ts-ignore
      onKeyDown(event?.target?.value)
    }

    if (event.key === 'Enter' && onEnter) {
      // @ts-ignore
      onEnter(event?.target?.value)
    }
  }

  if (type === 'textarea') {
    const handleTextAreaBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlurFunc) {
        onBlurFunc(event.target.value)
      }
    }

    return (
      <TextField
        type={inputType}
        label={label}
        size='small'
        error={Boolean(errorMessage)}
        helperText={errorMessage ? <div>{errorMessage}</div> : helperText ? helperText : undefined}
        required={required}
        id={id}
        style={{ width: '100%', ...style }}
        name={name}
        variant={variant}
        margin='dense'
        value={value}
        onChange={handleChange}
        inputProps={{
          maxLength,
          style: { imeMode },
          'data-testid': id,
        }}
        InputProps={{
          readOnly: readOnly,
        }}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        multiline
        maxRows={rowsMax}
        minRows={rowsMin}
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        onBlur={handleTextAreaBlur}
        onKeyDown={handleKeyDown}
        className={className}
      />
    )
  }

  if (type === 'number') {
    return (
      <TextField
        type='number'
        label={label}
        size='small'
        variant={variant}
        error={Boolean(errorMessage)}
        helperText={errorMessage ? <div>{errorMessage}</div> : helperText ? helperText : undefined}
        required={required}
        id={id}
        name={name}
        margin='dense'
        value={value}
        onChange={handleChange}
        style={{ width: '100%', ...style }}
        inputProps={{
          maxLength,
          scale: 1,
          displayedThousandsSeparator: true,
          style: { imeMode },
          'data-testid': id,
        }}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        InputProps={{
          readOnly,
          inputProps: { min: numberMin, max: numberMax, 'data-testid': id },
          startAdornment: prefix ? <div style={{ marginRight: '10px' }}>{prefix}</div> : undefined,
          endAdornment: suffix ? <div style={{ marginLeft: '10px' }}>{suffix}</div> : undefined,
        }}
        fullWidth={fullWidth}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={className}
      />
    )
  }
  return (
    <TextField
      type={inputType}
      label={label}
      size='small'
      variant={variant}
      error={Boolean(errorMessage)}
      helperText={errorMessage ? <div>{errorMessage}</div> : helperText ? helperText : undefined}
      required={required}
      id={id}
      name={name}
      margin='dense'
      value={value}
      onChange={handleChange}
      sx={{
        width: '100%',
        // '& .Mui-focused': {
        //   color: colorTokens?.blueAccent[900],
        // },
        ...style,
      }}
      inputProps={{
        maxLength,
        style: { imeMode },
        'data-testid': id,
      }}
      autoFocus={autoFocus}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={defaultValue}
      InputProps={{
        startAdornment: prefix ? <div style={{ marginRight: '10px' }}>{prefix}</div> : undefined,
        endAdornment: suffix ? <div style={{ marginLeft: '10px' }}>{suffix}</div> : undefined,
        readOnly: readOnly,
      }}
      // disableUnderline
      fullWidth={fullWidth}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={className}
    />
  )
}

export type TextInputProps = {
  type?: 'text' | 'password' | 'tel' | 'email' | 'textarea' | 'zip' | 'number'
  label?: string
  id: string
  required?: boolean
  helperText?: string
  name: string
  variant?: 'standard' | 'filled' | 'outlined' | undefined
  autoFocus?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  value?: string
  style?: React.CSSProperties
  errorMessage?: string
  placeholder?: string
  maxLength?: number
  control?: Control<any, object>
  imeMode?: 'auto' | 'active' | 'inactive' | 'disabled'
  rowsMin?: number | string
  rowsMax?: number | string
  onChange?: (value: any) => void
  onEnter?: (value: any) => void
  onKeyDown?: (event: string) => void
  defaultValue?: string
  prefix?: ReactNode
  suffix?: ReactNode
  fullWidth?: boolean
  autoCompleteOptions?: Array<string>
  onBlur?: (value: string) => void
  className?: string
  disableTrim?: boolean
  numberMin?: number
  numberMax?: number
}

const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  const { control, onBlur, onChange, ...others } = props

  const handleChange = (event: object) => {
    if (onChange) {
      //@ts-ignore
      onChange(event?.target?.value)
    }
  }

  if (control) {
    const { name } = others
    return (
      <Controller
        render={({ field: { onChange: handleChangeRender, value } }) => (
          <InnerTextInput
            {...props}
            onChange={(event: any) => {
              handleChangeRender(event)
              if (onChange) {
                onChange(event.target.value)
              }
              return event
            }}
            onBlurFunc={onBlur}
            value={value}
          />
        )}
        control={control}
        name={name}
      />
    )
  }

  return <InnerTextInput onBlurFunc={onBlur} onChange={handleChange} {...others} />
}

export default TextInput
