import { 
  SiYoutube, 
  SiInstagram, 
  SiFacebook, 
  SiLinkedin, 
  SiTwitch,
  SiTiktok,
  SiX
} from 'react-icons/si'
import { type IconType } from 'react-icons'

export interface Platform {
  id: string
  label: string
  icon: IconType
}

export const PLATFORMS: Platform[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    icon: SiYoutube
  },
  {
    id: 'instagram',
    label: 'Instagram', 
    icon: SiInstagram
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: SiTiktok
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: SiFacebook
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: SiLinkedin
  },
  {
    id: 'twitch',
    label: 'Twitch',
    icon: SiTwitch
  },
  {
    id: 'x_twitter',
    label: 'X (Twitter)',
    icon: SiX
  }
]

export default PLATFORMS 