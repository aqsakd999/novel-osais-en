import { useFormContext } from '@app/config/FormProvider'
import {
  FormLabel,
  Tooltip,
  FormHelperText,
  Typography,
  Fade,
  FormControl as MuiFormControl,
  CircularProgress,
} from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

const StyledMuiFormControl = styled(MuiFormControl)`
  justify-items: flex-start;
  align-items: center;

  & .MuiFormControl-root .MuiInputBase-root {
    margin-bottom: 5px;
  }

  & .MuiCircularProgress-root {
    height: max-content !important;
  }
` as typeof MuiFormControl

type Props = {
  children: React.ReactNode
  id: string
  label?: ReactNode
  required?: boolean
  error?: boolean
  style?: React.CSSProperties
  labelWidth?: number | string
  disabled?: boolean
  tooltip?: string
  suffix?: ReactNode | string
  errorMessage?: string
  height?: string
  isLoading?: boolean
}

const InlineForm: React.FC<Props> = ({
  id,
  label = '',
  suffix,
  height,
  required,
  style,
  error,
  labelWidth = 130,
  disabled,
  errorMessage,
  children,
  tooltip,
  isLoading = false,
}: Props) => {
  const { formDisable } = useFormContext()

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as ReactElement<any>, {
        disabled: disabled == undefined ? formDisable : disabled,
      })
    }
    return child
  })

  return (
    <StyledMuiFormControl
      variant='standard'
      error={!!error}
      fullWidth
      data-testid='inline-form-control'
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: height ? height : 'auto',
        ...style,
      }}
    >
      <FormLabel
        id={`${id}-label`}
        focused={false}
        disabled={disabled}
        style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
      >
        <Tooltip id={`${id}-tooltip`} title={tooltip ? tooltip : ''} placement='top-start' arrow>
          <Typography style={{ display: 'flex' }}>{`${label} ${required ? ' *' : ''}`}</Typography>
        </Tooltip>
      </FormLabel>
      <div style={{ width: '100%' }}>
        <div
          data-testid={`inline-form-${id}`}
          style={{ display: 'flex', alignItems: 'center', width: '100%' }}
        >
          <>{enhancedChildren}</>
          <div style={{ marginLeft: '10px' }}>{suffix}</div>
        </div>
        <div>{errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}</div>
      </div>
      {isLoading && (
        <Fade
          in={isLoading}
          style={{
            transitionDelay: isLoading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
      )}
    </StyledMuiFormControl>
  )
}

export default InlineForm
