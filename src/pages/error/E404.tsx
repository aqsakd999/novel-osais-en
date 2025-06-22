import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const E404 = () => {
  const { t } = useTranslation()
  return (
    <>
      <h4>{t('error.404')}</h4>
      <div>
        <Link to='/'>{t('home')}</Link>
      </div>
    </>
  )
}

export default E404
