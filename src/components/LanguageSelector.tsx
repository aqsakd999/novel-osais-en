import { readLanguageCode, saveLanguageCode } from '@app/locales/persistence'
import { LANGUAGES } from '@app/config/constants'
import i18next from 'i18next'
import { useState } from 'react'

/**
 * Language switcher component to let user select a custom language
 * @returns
 */
const LanguageSelector = () => {
  const [code, setCode] = useState(readLanguageCode())

  /**
   * Change current language
   * @param {SyntheticEvent} event
   */
  const onChange = (event: any) => {
    const {
      target: { value: currentCode },
    } = event
    setCode(currentCode)
    i18next.changeLanguage(currentCode)
    saveLanguageCode(currentCode)
  }

  return (
    <select value={code} onChange={(ev) => onChange(ev)}>
      {LANGUAGES.map((e) => (
        <option key={`language-${e.code}`} value={e.code}>
          {e.name}
        </option>
      ))}
    </select>
  )
}

export default LanguageSelector
