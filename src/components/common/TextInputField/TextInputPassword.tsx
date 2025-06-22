import { IconButton, InputAdornment, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import React, { ReactNode } from 'react'
import { Controller, Control } from 'react-hook-form'

type InnerProps = {
  label?: string
  variant?: 'standard' | 'filled' | 'outlined' | undefined
  id: string
  style?: React.CSSProperties
  required?: boolean
  name: string
  autoFocus?: boolean
  disabled?: boolean
  error?: boolean
  value?: string
  placeholder?: string
  maxLength?: number
  imeMode?: 'auto' | 'active' | 'inactive' | 'disabled'
  rowsMin?: number | string
  rowsMax?: number | string
  onChange?: (value: object) => void
  onEnter?: (value: string) => void
  onKeyDown?: (value: string) => void
  errorMessage?: string
  defaultValue?: string
  prefix?: ReactNode
  suffix?: ReactNode
  fullWidth?: boolean
  autoCompleteOptions?: Array<string>
  onBlurFunc?: (value: string) => void
  className?: string
  disableTrim?: boolean
}

const InnerTextInput: React.FC<InnerProps> = (props: InnerProps) => {
  const {
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
    placeholder,
    onChange,
    onEnter,
    onKeyDown,
    defaultValue,
    onBlurFunc,
    className,
    disableTrim,
  } = props
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event)
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
  return (
    <TextField
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      type={showPassword ? 'text' : 'password'}
      label={label}
      variant={variant}
      error={Boolean(errorMessage)}
      helperText={errorMessage ? <div>{errorMessage}</div> : undefined}
      required={required}
      id={id}
      name={name}
      margin='dense'
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      style={{ ...style }}
      inputProps={{
        maxLength,
        style: { imeMode },
        'data-testid': id,
      }}
      autoFocus={autoFocus}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={defaultValue}
      fullWidth={fullWidth}
      onBlur={handleBlur}
      className={className}
    />
  )
}

export type TextInputProps = {
  label?: string
  id: string
  required?: boolean
  name: string
  variant?: 'standard' | 'filled' | 'outlined' | undefined
  autoFocus?: boolean
  disabled?: boolean
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
  onChange?: (value: string) => void
  onEnter?: (value: string) => void
  onKeyDown?: (event: string) => void
  defaultValue?: string
  prefix?: ReactNode
  suffix?: ReactNode
  fullWidth?: boolean
  autoCompleteOptions?: Array<string>
  onBlur?: (value: string) => void
  className?: string
  disableTrim?: boolean
}

const TextInputPassword: React.FC<TextInputProps> = (props: TextInputProps) => {
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

export default TextInputPassword
