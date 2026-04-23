import { Icon, type IconName } from '@cardog-icons/react'
import { Car as CarFallback } from 'lucide-react'

const BRAND_ICON_MAP: Record<string, IconName> = {
  acura: 'AcuraLogo',
  'alfa romeo': 'AlfaRomeoLogo',
  alfa: 'AlfaRomeoLogo',
  'aston martin': 'AstonMartinLogo',
  astonmartin: 'AstonMartinLogo',
  audi: 'AudiLogo',
  bentley: 'BentleyLogo',
  bmw: 'BMWLogo',
  byd: 'BYDLogo',
  cadillac: 'CadillacLogo',
  chevrolet: 'ChevroletLogo',
  chevy: 'ChevroletLogo',
  chrysler: 'ChryslerLogo',
  dodge: 'DodgeLogo',
  ferrari: 'FerrariLogo',
  fiat: 'FiatLogo',
  ford: 'FordLogo',
  genesis: 'GenesisLogo',
  gmc: 'GMCLogo',
  honda: 'HondaLogo',
  hummer: 'HummerLogo',
  hyundai: 'HyundaiLogo',
  infiniti: 'InfinitiLogo',
  jaguar: 'JaguarLogo',
  jeep: 'JeepLogo',
  kia: 'KiaLogo',
  lamborghini: 'LamborghiniLogo',
  'land rover': 'LandroverLogo',
  landrover: 'LandroverLogo',
  lexus: 'LexusLogo',
  lincoln: 'LincolnLogo',
  lotus: 'LotusLogo',
  lucid: 'LucidLogo',
  maserati: 'MaseratiLogo',
  mazda: 'MazdaLogo',
  mb: 'MBLogo',
  mercedes: 'MBLogo',
  'mercedes-benz': 'MBLogo',
  mclaren: 'MclarenLogo',
  mini: 'MiniLogo',
  mitsubishi: 'MitsubishiLogo',
  nissan: 'NissanLogo',
  polestar: 'PolestarLogo',
  porsche: 'PorscheLogo',
  ram: 'RAMLogo',
  'rolls-royce': 'RollsRoyceLogo',
  rollsroyce: 'RollsRoyceLogo',
  subaru: 'SubaruLogo',
  tesla: 'TeslaLogo',
  toyota: 'ToyotaLogo',
  vinfast: 'VinfastLogo',
  volkswagen: 'VolkswagenLogo',
  vw: 'VolkswagenLogo',
  volvo: 'VolvoLogo',
}

export type CarBrandKey = keyof typeof BRAND_ICON_MAP

interface CarBrandLogoProps {
  brand: string
  size?: number
  className?: string
  'aria-label'?: string
}

export default function CarBrandLogo({
  brand,
  size = 32,
  className,
  'aria-label': ariaLabel,
}: CarBrandLogoProps) {
  const iconName = BRAND_ICON_MAP[brand.toLowerCase().trim()]

  if (!iconName) {
    return (
      <CarFallback
        size={size}
        className={className ?? 'text-gray-400'}
        aria-label={ariaLabel ?? brand}
      />
    )
  }

  return (
    <Icon
      name={iconName}
      size={size}
      className={className}
      aria-label={ariaLabel ?? brand}
    />
  )
}
