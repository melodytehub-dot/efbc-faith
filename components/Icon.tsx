import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Church,
  Clock,
  ExternalLink,
  Heart,
  HandHeart,
  Home,
  LayoutGrid,
  Mail,
  Mic,
  Menu,
  Music,
  Phone,
  Play,
  Radio,
  Search,
  Users,
  MapPin,
  X,
  type LucideIcon,
} from "lucide-react";

const icons = {
  home: Home,
  book: BookOpen,
  hands: HandHeart,
  church: Church,
  community: Users,
  live: Radio,
  more: LayoutGrid,
  search: Search,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  phone: Phone,
  mail: Mail,
  pin: MapPin,
  clock: Clock,
  play: Play,
  music: Music,
  mic: Mic,
  heart: Heart,
  calendar: CalendarDays,
  "arrow-right": ArrowRight,
  external: ExternalLink,
  menu: Menu,
  close: X,
} satisfies Record<string, LucideIcon>;

type IconName = keyof typeof icons;

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const Cmp = icons[name];
  return <Cmp className={`ic ${className}`.trim()} strokeWidth={1.8} aria-hidden="true" focusable="false" />;
}

export type { IconName };
