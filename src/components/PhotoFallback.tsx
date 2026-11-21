import { Icon, type IconName } from './Icon'

/**
 * Designed stand-in for cards whose subject has no real photograph yet.
 * Keeps the card rhythm intact with the grid texture, gold glow and icon tile.
 */
export function PhotoFallback({ icon }: { icon: IconName }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(214,173,85,0.3),transparent_62%)]"
      />
      <div aria-hidden="true" className="absolute inset-5 rounded-[14px] border border-white/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-royal-deep/60 text-gold shadow-[0_0_38px_-12px_rgba(214,173,85,0.8)]">
          <Icon name={icon} className="h-7 w-7" />
        </span>
      </div>
    </>
  )
}
