import { useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { usePrefersReducedMotion } from '../lib/hooks'

export function TiltCard({
  children,
  className,
  max = 6,
  glare = true,
}: {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch') return
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    element.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`)
    element.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`)
    element.style.setProperty('--mx', `${x * 100}%`)
    element.style.setProperty('--my', `${y * 100}%`)
  }

  const onPointerLeave = () => {
    const element = ref.current
    if (!element) return
    element.style.setProperty('--ry', '0deg')
    element.style.setProperty('--rx', '0deg')
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn('group relative tilt-card', className)}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="tilt-glare pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
        />
      )}
    </div>
  )
}
