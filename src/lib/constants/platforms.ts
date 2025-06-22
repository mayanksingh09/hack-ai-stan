import { 
  SiYoutube, 
  SiInstagram, 
  SiX, 
  SiFacebook, 
  SiLinkedin, 
  SiTwitch,
  SiTiktok
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
    id: 'twitter',
    label: 'X',
    icon: SiX
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
  }
]

export default PLATFORMS 