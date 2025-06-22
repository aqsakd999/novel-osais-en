import { useLocation } from 'react-router-dom'
import Section from './Section'

const SectionContainer = () => {
  const { search: searchCat } = useLocation()

  const queryParams = new URLSearchParams(searchCat)
  const type = queryParams.get('type') || ''

  return <Section key={type} type={type} />
}

export default SectionContainer
