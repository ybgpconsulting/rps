import { useCallback, useState } from 'react'
import { cn } from '../lib/cn'

const WIDTHS = [640, 1000, 1600]

type SmartImageProps = {
  name: string
  alt: string
  imageUrl?: string
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
}

export function SmartImage({
  name,
  alt,
  imageUrl = '',
  className,
  imgClassName = 'h-full w-full object-cover',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw',
  priority = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)

  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true)
  }, [])

  return (
    <img
      ref={ref}
      src={imageUrl || `/images/${name}-1600.webp`}
      srcSet={imageUrl ? undefined : WIDTHS.map((width) => `/images/${name}-${width}.webp ${width}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      width={1600}
      height={1067}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={cn(
        imgClassName,
        'transition-opacity duration-700 ease-out',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}
