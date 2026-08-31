import { useEffect } from 'react'
import { applyPageMeta } from '../../utils/seo'

export default function PageMeta({
  title,
  description,
  path = '/',
  robots,
  image,
  type = 'website',
}) {
  useEffect(() => {
    applyPageMeta({ title, description, path, robots, image, type })
  }, [title, description, path, robots, image, type])

  return null
}
