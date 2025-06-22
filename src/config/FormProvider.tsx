import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FormContextValue {
  formDisable: boolean
  setFormDisable: React.Dispatch<React.SetStateAction<boolean>>
}

const FormContext = createContext<FormContextValue | null>(null)

export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext)
  return (
    context ?? {
      formDisable: false,
      setFormDisable: () => {
        console.warn('useFormContext was called outside of FormProvider.')
      },
    }
  )
}

export const FormProvider = ({
  children,
  defaultDisabled = false,
}: {
  children: ReactNode
  defaultDisabled?: boolean
}) => {
  const [formDisable, setFormDisable] = useState(defaultDisabled)

  return (
    <FormContext.Provider value={{ formDisable, setFormDisable }}>{children}</FormContext.Provider>
  )
}
