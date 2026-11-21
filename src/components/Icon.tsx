import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { BookOpen } from '@phosphor-icons/react/dist/csr/BookOpen'
import { Bus } from '@phosphor-icons/react/dist/csr/Bus'
import { Camera } from '@phosphor-icons/react/dist/csr/Camera'
import { CaretDown } from '@phosphor-icons/react/dist/csr/CaretDown'
import { CaretLeft } from '@phosphor-icons/react/dist/csr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/csr/CaretRight'
import { ChatCircle } from '@phosphor-icons/react/dist/csr/ChatCircle'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import { Clock } from '@phosphor-icons/react/dist/csr/Clock'
import { Download } from '@phosphor-icons/react/dist/csr/Download'
import { Envelope } from '@phosphor-icons/react/dist/csr/Envelope'
import { FacebookLogo } from '@phosphor-icons/react/dist/csr/FacebookLogo'
import { Flask } from '@phosphor-icons/react/dist/csr/Flask'
import { Globe } from '@phosphor-icons/react/dist/csr/Globe'
import { GoogleLogo } from '@phosphor-icons/react/dist/csr/GoogleLogo'
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap'
import { Heart } from '@phosphor-icons/react/dist/csr/Heart'
import { House } from '@phosphor-icons/react/dist/csr/House'
import { Image } from '@phosphor-icons/react/dist/csr/Image'
import { InstagramLogo } from '@phosphor-icons/react/dist/csr/InstagramLogo'
import { Leaf } from '@phosphor-icons/react/dist/csr/Leaf'
import { List } from '@phosphor-icons/react/dist/csr/List'
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin'
import { MapTrifold } from '@phosphor-icons/react/dist/csr/MapTrifold'
import { Monitor } from '@phosphor-icons/react/dist/csr/Monitor'
import { Newspaper } from '@phosphor-icons/react/dist/csr/Newspaper'
import { PaperPlaneTilt } from '@phosphor-icons/react/dist/csr/PaperPlaneTilt'
import { Phone } from '@phosphor-icons/react/dist/csr/Phone'
import { Play } from '@phosphor-icons/react/dist/csr/Play'
import { Quotes } from '@phosphor-icons/react/dist/csr/Quotes'
import { Scales } from '@phosphor-icons/react/dist/csr/Scales'
import { ShieldCheck } from '@phosphor-icons/react/dist/csr/ShieldCheck'
import { Snowflake } from '@phosphor-icons/react/dist/csr/Snowflake'
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle'
import { Star } from '@phosphor-icons/react/dist/csr/Star'
import { Trophy } from '@phosphor-icons/react/dist/csr/Trophy'
import { User } from '@phosphor-icons/react/dist/csr/User'
import { Users } from '@phosphor-icons/react/dist/csr/Users'
import { WhatsappLogo } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { X } from '@phosphor-icons/react/dist/csr/X'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'

export type IconName =
  | 'home'
  | 'book'
  | 'image'
  | 'phone'
  | 'message'
  | 'news'
  | 'whatsapp'
  | 'pin'
  | 'clock'
  | 'check'
  | 'star'
  | 'snowflake'
  | 'sparkles'
  | 'shield'
  | 'users'
  | 'scale'
  | 'trophy'
  | 'flask'
  | 'monitor'
  | 'bus'
  | 'leaf'
  | 'cap'
  | 'camera'
  | 'heart'
  | 'quote'
  | 'arrowRight'
  | 'arrowUpRight'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'menu'
  | 'close'
  | 'download'
  | 'globe'
  | 'send'
  | 'mail'
  | 'user'
  | 'map'
  | 'play'
  | 'instagram'
  | 'facebook'
  | 'google'

const icons: Record<IconName, PhosphorIcon> = {
  home: House,
  book: BookOpen,
  image: Image,
  phone: Phone,
  message: ChatCircle,
  news: Newspaper,
  whatsapp: WhatsappLogo,
  pin: MapPin,
  clock: Clock,
  check: Check,
  star: Star,
  snowflake: Snowflake,
  sparkles: Sparkle,
  shield: ShieldCheck,
  users: Users,
  scale: Scales,
  trophy: Trophy,
  flask: Flask,
  monitor: Monitor,
  bus: Bus,
  leaf: Leaf,
  cap: GraduationCap,
  camera: Camera,
  heart: Heart,
  quote: Quotes,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  chevronRight: CaretRight,
  chevronLeft: CaretLeft,
  chevronDown: CaretDown,
  menu: List,
  close: X,
  download: Download,
  globe: Globe,
  send: PaperPlaneTilt,
  mail: Envelope,
  user: User,
  map: MapTrifold,
  play: Play,
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  google: GoogleLogo,
}

export function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName
  className?: string
}) {
  const IconComponent = icons[name]
  return <IconComponent className={className} weight="regular" aria-hidden="true" focusable="false" />
}
