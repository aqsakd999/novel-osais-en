import { LANGUAGE_DEFAULT } from '@app/config/constants'
import { getAsString, setAsString } from '@app/helpers/LocalStorageUtils'

const LANGUAGE_KEY = 'LANG'

/**
 * Read saved language code from storage
 * @returns string
 */
export const readLanguageCode = () => {
  return getAsString(LANGUAGE_KEY, LANGUAGE_DEFAULT)
}

/**
 * Save language code to storage
 * @param {string} code Language code
 * @returns
 */
export const saveLanguageCode = (code: string) => setAsString(LANGUAGE_KEY, code)
