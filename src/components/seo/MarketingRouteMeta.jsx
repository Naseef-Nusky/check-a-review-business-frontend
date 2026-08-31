import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyPageMeta, DEFAULT_SEO, getMarketingRouteSeo } from '../../utils/seo'

export default function MarketingRouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const routeMeta = getMarketingRouteSeo(pathname)
    if (routeMeta) {
      applyPageMeta(routeMeta)
      return
    }

    applyPageMeta(DEFAULT_SEO)
  }, [pathname])

  return null
}
