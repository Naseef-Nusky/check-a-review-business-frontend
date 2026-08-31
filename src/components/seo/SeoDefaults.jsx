import { useEffect } from 'react'
import { applySiteDefaults } from '../../utils/seo'

export default function SeoDefaults() {
  useEffect(() => {
    applySiteDefaults()
  }, [])

  return null
}
