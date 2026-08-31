import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyPageMeta, PORTAL_SEO } from '../../utils/seo'

export default function PortalRouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    applyPageMeta({
      ...PORTAL_SEO,
      path: pathname || '/dashboard',
    })
  }, [pathname])

  return null
}
