import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation()

  return (
    <div>
      <i>About</i> {t('about.text')}
    </div>
  )
}

export default About
