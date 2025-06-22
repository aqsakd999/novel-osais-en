/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/prefer-screen-queries */
import { act, fireEvent, getByRole, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Gets an input element by invoking screen.getByTestId(testId). If the element is not an input, it will try to get its child element by role.
 * @param testId
 * @param role Default is 'textbox'
 * @returns
 */
export const getInputByTestId = (testId: string, role?: string) => {
  const obj = screen.getByTestId(testId)
  return obj.tagName === 'INPUT'
    ? (obj as HTMLInputElement)
    : getByRole<HTMLInputElement>(obj, role ?? 'textbox')
}

/**
 * Gets a textarea element by invoking screen.getByTestId(testId). If the element is not a textarea, it will try to get its child element by role.
 * @param testId
 * @param role Default is 'textbox'
 * @returns
 */
export const getTextAreaByTestId = (testId: string, role?: string) => {
  const obj = screen.getByTestId(testId)
  return obj.tagName === 'TEXTAREA'
    ? (obj as HTMLTextAreaElement)
    : getByRole<HTMLTextAreaElement>(obj, role ?? 'textbox')
}

/**
 * Gets a file element by invoking screen.getByTestId(testId). If the element is not a file, it will try to get its child element by role.
 * @param testId
 * @returns
 */
export const getFileInputByTestId = (testId: string) => {
  let obj = screen.getByTestId(testId)
  if (obj.tagName !== 'INPUT') {
    const children = obj.getElementsByTagName('input')
    for (let index = 0; index < children.length; index++) {
      const element = children.item(index)
      if (element?.type === 'file') {
        obj = element
        break
      }
    }
  }
  return obj as HTMLInputElement
}

/**
 * Gets a button element by invoking screen.getByTestId(testId). If the element is not a button, it will try to get its child element by role.
 * @param testId
 * @param role Default is 'button'
 * @returns
 */
export const getButtonByTestId = (testId: string, role?: string) => {
  const obj = screen.getByTestId(testId)
  return obj.tagName === 'BUTTON'
    ? (obj as HTMLButtonElement)
    : getByRole<HTMLButtonElement>(obj, role ?? 'button')
}

/**
 * Clears input fields by testId
 * @param testIds Array of testIds
 */
export const clearInputsByTestId = async (testIds: string[]) => {
  await act(async () => {
    testIds.forEach((testId) => {
      const input = getInputByTestId(testId)
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.blur(input)
    })
  })
}

/**
 * Gets a random item from an array
 * @param array
 * @returns
 */
export const getRandomElement = (array: any[]) => array[Math.floor(Math.random() * array.length)]

const MIME_TYPE: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
  txt: 'text/plain',
  json: 'application/json',
  pdf: 'application/pdf',
}

/**
 * Creates File object with fake data
 * @param fileName File name
 * @param fileSize File size in KB
 * @returns
 */
export const fakeFile = (fileName: string, fileSize: number) => {
  const fileExt = fileName.split('.').pop()
  const type = fileExt ? MIME_TYPE[fileExt] ?? '' : ''
  const file = new File(['a'], fileName, { type })
  Object.defineProperty(file, 'size', { value: fileSize * 1024, configurable: true })
  return file
}

export function generateRandomString(length = 100) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charsetLength = charset.length

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength)
    result += charset[randomIndex]
  }

  return result
}

/**
 * mock user input for TextInput
 */
export const mockTypeTextField = async (input: HTMLElement, value: string, equal = true) => {
  await userEvent.clear(input)
  await userEvent.type(input, value)
  if (equal) {
    expect(input).toHaveValue(value)
  } else {
    expect(input).not.toHaveValue(value)
  }
}

/**
 * mock user input for NumberInput
 */
export const mockInputNumberField = async (
  input: HTMLElement,
  value: number | string,
  equal = true,
) => {
  await userEvent.clear(input)
  await userEvent.type(input, value != undefined ? `${value}` : '')
  if (equal) {
    expect(input).toHaveValue(value)
  } else {
    expect(input).not.toHaveValue(value)
  }
}
